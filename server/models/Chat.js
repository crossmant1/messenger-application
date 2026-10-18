import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chatName: { type: String, required: function() {return this.isGroupChat;} },
  isGroupChat: {type: Boolean, default: false},
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  chatOwner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  chatID: { type: String, required: true, unique: true },

}, {timestamps: true});

export default mongoose.model('Chat', chatSchema);