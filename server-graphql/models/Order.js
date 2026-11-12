import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, validate: Number.isInteger },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customerName: { type: String, required: true, trim: true, maxlength: 120 },
    customerPhone: { type: String, required: true, trim: true, maxlength: 30 },
    items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['NEW', 'PROCESSING', 'COMPLETED', 'CANCELLED'], default: 'NEW', index: true },
    stockReserved: { type: Boolean, default: true },
  },
  { timestamps: true },
);

orderSchema.index({ companyId: 1, createdAt: -1 });
orderSchema.index({ companyId: 1, createdBy: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);
