import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';

export function fail(message, code = 'BAD_USER_INPUT') {
  throw new GraphQLError(message, { extensions: { code } });
}

export function requireAuth(context) {
  if (!context.user) fail('Для виконання цієї дії потрібно увійти в систему.', 'UNAUTHENTICATED');
  if (!context.user.isActive) fail('Обліковий запис деактивовано.', 'FORBIDDEN');
  return context.user;
}

export function requireAdmin(context) {
  const user = requireAuth(context);
  if (user.role !== 'ADMIN') fail('Недостатньо прав для виконання цієї дії.', 'FORBIDDEN');
  return user;
}

export function requireDropshipper(context) {
  const user = requireAuth(context);
  if (user.role !== 'DROPSHIPPER') fail('Ця дія доступна лише дропшиперу.', 'FORBIDDEN');
  return user;
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function validateRegistration({ name, email, password }) {
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
    fail("Ім'я має містити від 2 до 80 символів.");
  }
  const normalizedEmail = normalizeEmail(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) fail('Вкажи коректну електронну адресу.');
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    fail('Пароль має містити від 8 до 128 символів.');
  }
  return normalizedEmail;
}

export function validateProduct(input) {
  const name = String(input.name || '').trim();
  const sku = String(input.sku || '').trim().toUpperCase();
  const category = String(input.category || '').trim();
  const description = String(input.description || '').trim();
  const price = Number(input.price);
  const stock = Number(input.stock);

  if (name.length < 2 || name.length > 140) fail('Назва товару має містити від 2 до 140 символів.');
  if (!sku || sku.length > 40) fail('Артикул SKU є обов’язковим (до 40 символів).');
  if (!category || category.length > 60) fail('Вкажи коректну категорію товару.');
  if (!Number.isFinite(price) || price < 0 || Math.abs(Math.round(price * 100) - price * 100) > 1e-8) fail('Ціна має бути невід’ємним числом із точністю до 2 знаків.');
  if (!Number.isInteger(stock) || stock < 0) fail('Залишок має бути цілим невід’ємним числом.');

  return { name, sku, category, description, price, stock };
}

export function assertObjectId(value, label = 'ідентифікатор') {
  if (!mongoose.Types.ObjectId.isValid(String(value || ''))) fail(`Некоректний ${label}.`);
  return String(value);
}
