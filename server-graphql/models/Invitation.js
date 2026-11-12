import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    codeHash: { type: String, required: true, unique: true, select: false },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    usesCount: { type: Number, default: 0, min: 0 },
    maxUses: { type: Number, default: 1, min: 1, max: 1 },
  },
  { timestamps: true },
);

invitationSchema.index({ companyId: 1, createdAt: -1 });

export default mongoose.model('Invitation', invitationSchema);
