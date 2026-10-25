import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'PrimerUser', required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
