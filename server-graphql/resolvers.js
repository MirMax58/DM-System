import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import Company from './models/Company.js';
import User from './models/User.js';
import Invitation from './models/Invitation.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import {
  createInvitationCode,
  createToken,
  hashInvitationCode,
  safeAuthError,
} from './utils/security.js';
import {
  assertObjectId,
  fail,
  normalizeEmail,
  requireAdmin,
  requireAuth,
  requireDropshipper,
  validateProduct,
  validateRegistration,
} from './utils/errors.js';

const ACTIVE_ORDER_STATUSES = ['NEW', 'PROCESSING'];
const ORDER_TRANSITIONS = {
  NEW: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

const idOf = (value) => value?._id?.toString?.() || value?.toString?.() || null;
const asIso = (value) => value ? new Date(value).toISOString() : null;
const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

function publicUser(user) {
  return user;
}

async function restoreReservedStock(order) {
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.productId, companyId: order.companyId },
      { $inc: { stock: item.quantity } },
    );
  }
}

async function createAuthPayload(user) {
  return { token: createToken(user), user: publicUser(user) };
}

export const resolvers = {
  Query: {
    me: (_parent, _args, context) => context.user || null,
    company: async (_parent, _args, context) => {
      const user = requireAuth(context);
      const company = await Company.findById(user.companyId);
      if (!company) fail('Компанію користувача не знайдено.', 'NOT_FOUND');
      return company;
    },
    users: async (_parent, _args, context) => {
      const admin = requireAdmin(context);
      return User.find({ companyId: admin.companyId }).sort({ createdAt: -1 });
    },
    products: async (_parent, _args, context) => {
      const user = requireAuth(context);
      return Product.find({ companyId: user.companyId }).sort({ createdAt: -1 });
    },
    orders: async (_parent, _args, context) => {
      const user = requireAuth(context);
      const filter = { companyId: user.companyId };
      if (user.role === 'DROPSHIPPER') filter.createdBy = user._id;
      return Order.find(filter).sort({ createdAt: -1 });
    },
    invitations: async (_parent, _args, context) => {
      const admin = requireAdmin(context);
      return Invitation.find({ companyId: admin.companyId }).sort({ createdAt: -1 });
    },
  },

  Mutation: {
    registerCompany: async (_parent, { input }) => {
      const email = validateRegistration(input);
      const companyName = String(input.companyName || '').trim();
      if (companyName.length < 2 || companyName.length > 100) fail('Назва компанії має містити від 2 до 100 символів.');
      if (await User.exists({ email })) fail('Користувач із такою електронною адресою вже існує.', 'CONFLICT');

      const passwordHash = await bcrypt.hash(input.password, 12);
      let company;
      let user;
      try {
        company = await Company.create({ name: companyName });
        user = await User.create({
          name: input.name.trim(),
          email,
          passwordHash,
          role: 'ADMIN',
          companyId: company._id,
        });
        company.ownerId = user._id;
        await company.save();
        return createAuthPayload(user);
      } catch (error) {
        if (user?._id) await User.deleteOne({ _id: user._id });
        if (company?._id) await Company.deleteOne({ _id: company._id });
        if (error?.code === 11000) fail('Користувач із такою електронною адресою вже існує.', 'CONFLICT');
        throw error;
      }
    },

    joinCompany: async (_parent, { input }) => {
      const email = validateRegistration(input);
      const code = String(input.invitationCode || '').trim().toUpperCase();
      if (code.length < 8 || code.length > 32) fail('Вкажи коректний код запрошення.');
      if (await User.exists({ email })) fail('Користувач із такою електронною адресою вже існує.', 'CONFLICT');

      const invitation = await Invitation.findOneAndUpdate(
        {
          codeHash: hashInvitationCode(code),
          revokedAt: null,
          expiresAt: { $gt: new Date() },
          $expr: { $lt: ['$usesCount', '$maxUses'] },
        },
        { $inc: { usesCount: 1 } },
        { new: true },
      );
      if (!invitation) fail('Код запрошення недійсний, використаний або прострочений.', 'BAD_USER_INPUT');

      try {
        const companyExists = await Company.exists({ _id: invitation.companyId });
        if (!companyExists) fail('Компанію за цим запрошенням не знайдено.', 'NOT_FOUND');
        const passwordHash = await bcrypt.hash(input.password, 12);
        const user = await User.create({
          name: input.name.trim(),
          email,
          passwordHash,
          role: 'DROPSHIPPER',
          companyId: invitation.companyId,
        });
        return createAuthPayload(user);
      } catch (error) {
        await Invitation.updateOne({ _id: invitation._id, usesCount: { $gt: 0 } }, { $inc: { usesCount: -1 } });
        if (error?.code === 11000) fail('Користувач із такою електронною адресою вже існує.', 'CONFLICT');
        throw error;
      }
    },

    login: async (_parent, { email, password }) => {
      const normalizedEmail = normalizeEmail(email);
      const user = await User.findOne({ email: normalizedEmail, isActive: true }).select('+passwordHash');
      if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash))) safeAuthError();
      return createAuthPayload(user);
    },

    updateCompany: async (_parent, { name }, context) => {
      const admin = requireAdmin(context);
      const cleanName = String(name || '').trim();
      if (cleanName.length < 2 || cleanName.length > 100) fail('Назва компанії має містити від 2 до 100 символів.');
      return Company.findOneAndUpdate(
        { _id: admin.companyId },
        { $set: { name: cleanName } },
        { new: true, runValidators: true },
      );
    },

    createInvitation: async (_parent, { expiresInDays = 7 }, context) => {
      const admin = requireAdmin(context);
      if (!Number.isInteger(expiresInDays) || expiresInDays < 1 || expiresInDays > 30) {
        fail('Термін дії запрошення має бути від 1 до 30 днів.');
      }
      const code = createInvitationCode();
      const invitation = await Invitation.create({
        codeHash: hashInvitationCode(code),
        companyId: admin.companyId,
        createdBy: admin._id,
        expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
        maxUses: 1,
      });
      return { code, invitation };
    },

    revokeInvitation: async (_parent, { id }, context) => {
      const admin = requireAdmin(context);
      assertObjectId(id, 'ідентифікатор запрошення');
      const invitation = await Invitation.findOneAndUpdate(
        { _id: id, companyId: admin.companyId, revokedAt: null },
        { $set: { revokedAt: new Date() } },
        { new: true },
      );
      if (!invitation) fail('Запрошення не знайдено або воно вже відкликане.', 'NOT_FOUND');
      return invitation;
    },

    updateUserStatus: async (_parent, { id, isActive }, context) => {
      const admin = requireAdmin(context);
      assertObjectId(id, 'ідентифікатор користувача');
      const target = await User.findOne({ _id: id, companyId: admin.companyId });
      if (!target) fail('Користувача не знайдено.', 'NOT_FOUND');
      if (idOf(target) === idOf(admin) && !isActive) fail('Не можна деактивувати власний обліковий запис.', 'FORBIDDEN');
      if (target.role === 'ADMIN' && !isActive) {
        const activeAdmins = await User.countDocuments({ companyId: admin.companyId, role: 'ADMIN', isActive: true });
        if (activeAdmins <= 1) fail('У компанії має залишитися щонайменше один активний адміністратор.');
      }
      target.isActive = Boolean(isActive);
      await target.save();
      return target;
    },

    createProduct: async (_parent, { input }, context) => {
      const admin = requireAdmin(context);
      const data = validateProduct(input);
      try {
        return await Product.create({ ...data, companyId: admin.companyId });
      } catch (error) {
        if (error?.code === 11000) fail('Товар з таким артикулом уже існує в цій компанії.', 'CONFLICT');
        throw error;
      }
    },

    updateProduct: async (_parent, { id, input }, context) => {
      const admin = requireAdmin(context);
      assertObjectId(id, 'ідентифікатор товару');
      const data = validateProduct(input);
      try {
        const product = await Product.findOneAndUpdate(
          { _id: id, companyId: admin.companyId },
          { $set: data },
          { new: true, runValidators: true },
        );
        if (!product) fail('Товар не знайдено.', 'NOT_FOUND');
        return product;
      } catch (error) {
        if (error?.code === 11000) fail('Товар з таким артикулом уже існує в цій компанії.', 'CONFLICT');
        throw error;
      }
    },

    deleteProduct: async (_parent, { id }, context) => {
      const admin = requireAdmin(context);
      assertObjectId(id, 'ідентифікатор товару');
      const product = await Product.findOne({ _id: id, companyId: admin.companyId });
      if (!product) fail('Товар не знайдено.', 'NOT_FOUND');
      const hasActiveOrders = await Order.exists({
        companyId: admin.companyId,
        status: { $in: ACTIVE_ORDER_STATUSES },
        'items.productId': product._id,
      });
      if (hasActiveOrders) fail('Товар є в активному замовленні. Спочатку заверши або скасуй це замовлення.');
      await Product.deleteOne({ _id: product._id, companyId: admin.companyId });
      return true;
    },

    createOrder: async (_parent, { input }, context) => {
      const dropshipper = requireDropshipper(context);
      const customerName = String(input.customerName || '').trim();
      const customerPhone = String(input.customerPhone || '').trim();
      if (customerName.length < 2 || customerName.length > 120) fail("Вкажи коректне ім'я клієнта.");
      if (customerPhone.length < 7 || customerPhone.length > 30) fail('Вкажи коректний телефон клієнта.');
      if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 30) fail('Замовлення має містити від 1 до 30 позицій.');

      const quantities = new Map();
      for (const item of input.items) {
        const productId = assertObjectId(item.productId, 'ідентифікатор товару');
        const quantity = Number(item.quantity);
        if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 10000) fail('Перевір товар і кількість у замовленні.');
        quantities.set(productId, (quantities.get(productId) || 0) + quantity);
      }

      const productIds = [...quantities.keys()];
      const products = await Product.find({ _id: { $in: productIds }, companyId: dropshipper.companyId });
      if (products.length !== productIds.length) fail('Один або декілька товарів не належать вашій компанії або вже недоступні.');

      const reserved = [];
      try {
        for (const product of products) {
          const quantity = quantities.get(idOf(product));
          const updated = await Product.findOneAndUpdate(
            { _id: product._id, companyId: dropshipper.companyId, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { new: true },
          );
          if (!updated) fail(`Недостатньо залишку товару «${product.name}».`);
          reserved.push({ product, quantity });
        }

        const items = products.map((product) => ({
          productId: product._id,
          sku: product.sku,
          productName: product.name,
          quantity: quantities.get(idOf(product)),
          unitPrice: product.price,
        }));
        const total = roundMoney(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
        const orderNumber = `DM-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        return await Order.create({
          orderNumber,
          companyId: dropshipper.companyId,
          createdBy: dropshipper._id,
          customerName,
          customerPhone,
          items,
          total,
          status: 'NEW',
          stockReserved: true,
        });
      } catch (error) {
        for (const entry of reserved) {
          await Product.updateOne(
            { _id: entry.product._id, companyId: dropshipper.companyId },
            { $inc: { stock: entry.quantity } },
          );
        }
        throw error;
      }
    },

    updateOrderStatus: async (_parent, { id, status }, context) => {
      const admin = requireAdmin(context);
      assertObjectId(id, 'ідентифікатор замовлення');
      const order = await Order.findOne({ _id: id, companyId: admin.companyId });
      if (!order) fail('Замовлення не знайдено.', 'NOT_FOUND');
      if (!ORDER_TRANSITIONS[order.status]?.includes(status)) fail(`Перехід зі статусу ${order.status} у ${status} заборонений.`);

      const shouldRestore = status === 'CANCELLED' && order.stockReserved;
      const updated = await Order.findOneAndUpdate(
        { _id: order._id, companyId: admin.companyId, status: order.status, stockReserved: order.stockReserved },
        { $set: { status, ...((shouldRestore || status === 'COMPLETED') ? { stockReserved: false } : {}) } },
        { new: true },
      );
      if (!updated) fail('Замовлення вже було змінено іншим запитом. Онови сторінку.', 'CONFLICT');
      if (shouldRestore) await restoreReservedStock(order);
      return updated;
    },

    deleteOrder: async (_parent, { id }, context) => {
      const admin = requireAdmin(context);
      assertObjectId(id, 'ідентифікатор замовлення');
      const order = await Order.findOne({ _id: id, companyId: admin.companyId });
      if (!order) fail('Замовлення не знайдено.', 'NOT_FOUND');
      if (order.stockReserved) {
        const locked = await Order.findOneAndUpdate(
          { _id: order._id, companyId: admin.companyId, stockReserved: true },
          { $set: { stockReserved: false } },
          { new: true },
        );
        if (locked) await restoreReservedStock(order);
      }
      await Order.deleteOne({ _id: order._id, companyId: admin.companyId });
      return true;
    },
  },

  Company: {
    id: (parent) => idOf(parent),
    ownerId: (parent) => idOf(parent.ownerId),
    ownerName: async (parent) => {
      if (!parent.ownerId) return '';
      const owner = await User.findById(parent.ownerId).select('name');
      return owner?.name || '';
    },
    createdAt: (parent) => asIso(parent.createdAt),
    updatedAt: (parent) => asIso(parent.updatedAt),
  },

  User: {
    id: (parent) => idOf(parent),
    companyId: (parent) => idOf(parent.companyId),
    company: async (parent) => Company.findById(parent.companyId),
    companyName: async (parent) => {
      const company = await Company.findById(parent.companyId).select('name');
      return company?.name || '';
    },
    createdAt: (parent) => asIso(parent.createdAt),
  },

  Product: {
    id: (parent) => idOf(parent),
    companyId: (parent) => idOf(parent.companyId),
    createdAt: (parent) => asIso(parent.createdAt),
    updatedAt: (parent) => asIso(parent.updatedAt),
  },

  OrderItem: {
    productId: (parent) => idOf(parent.productId),
    lineTotal: (parent) => roundMoney(parent.unitPrice * parent.quantity),
  },

  Order: {
    id: (parent) => idOf(parent),
    createdBy: (parent) => idOf(parent.createdBy),
    createdByName: async (parent) => {
      const user = await User.findById(parent.createdBy).select('name');
      return user?.name || 'Користувач';
    },
    createdAt: (parent) => asIso(parent.createdAt),
    updatedAt: (parent) => asIso(parent.updatedAt),
  },

  Invitation: {
    id: (parent) => idOf(parent),
    expiresAt: (parent) => asIso(parent.expiresAt),
    createdAt: (parent) => asIso(parent.createdAt),
    revokedAt: (parent) => asIso(parent.revokedAt),
    isUsable: (parent) => !parent.revokedAt && parent.expiresAt > new Date() && parent.usesCount < parent.maxUses,
  },
};
