import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrimerUser', required: true
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PrimerUser' }]
}, { timestamps: true });

boardSchema.index({ members: 1, createdAt: -1 });
export const StudyBoard = mongoose.model('StudyBoard', boardSchema);