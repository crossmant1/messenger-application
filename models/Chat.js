import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chatName: { type: String, required: function() { return this.isGroupChat; } },
  isGroupChat: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PrimerUser' }],
  chatOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'PrimerUser' },
  chatID: { type: String, required: true, unique: true },

}, {timestamps: true});

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);
