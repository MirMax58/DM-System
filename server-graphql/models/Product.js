import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 140 },
    sku: { type: String, required: true, trim: true, uppercase: true, maxlength: 40 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, default: '', trim: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
  },
  { timestamps: true },
);

productSchema.index({ companyId: 1, sku: 1 }, { unique: true });
productSchema.index({ companyId: 1, category: 1 });
productSchema.index({ companyId: 1, name: 'text', sku: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
