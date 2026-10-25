import { Router } from 'express';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import { PrimerUser } from '../models/PrimerUser.js';
import { normalizedUsername } from '../auth/input.js';

export const chatsRouter = Router();
const idPattern = /^[0-9a-f]{24}$/i;

function viewChat(chat, userId) {
  const other = chat.participants.find(
    participant => participant._id.toString() !== userId
  );
  return {
    id: chat._id.toString(),
    username: other?.username ?? 'Unknown user',
    createdAt: chat.createdAt
  };
}

function viewMessage(message) {
  return {
    id: message._id.toString(),
    chatId: message.chat.toString(),
    senderId: message.sender.toString(),
    body: message.message,
    createdAt: message.createdAt
  };
}

async function memberChat(chatId, userId) {
  if (!idPattern.test(chatId)) return null;
  return Chat.findOne({ _id: chatId, participants: userId }).select('_id').lean();
}

chatsRouter.get('/', async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.auth.userId })
      .populate('participants', 'username')
      .sort({ updatedAt: -1, _id: -1 }).limit(100).lean();
    return res.status(200).json({
      chats: chats.map(chat => viewChat(chat, req.auth.userId))
    });
  } catch (err) {
    next(err);
  }
});

chatsRouter.post('/', async (req, res, next) => {
  const username = normalizedUsername(req.body?.username);
  if (username === null) {
    return res.status(400).json({ error: 'invalid username' });
  }
  try {
    const other = await PrimerUser.findOne({ username }).select('_id username').lean();
    if (!other) return res.status(404).json({ error: 'user not found' });
    if (other._id.toString() === req.auth.userId) {
      return res.status(400).json({ error: 'cannot chat with yourself' });
    }

    const participantIds = [req.auth.userId, other._id.toString()].sort();
    const chatID = `direct:${participantIds.join(':')}`;
    let chat = await Chat.findOne({ chatID });
    if (!chat) {
      try {
        chat = await Chat.create({
          chatID,
          participants: participantIds,
          chatOwner: req.auth.userId,
          isGroupChat: false
        });
      } catch (err) {
        if (err?.code !== 11000) throw err;
        chat = await Chat.findOne({ chatID });
      }
    }
    await chat.populate('participants', 'username');
    return res.status(200).json({ chat: viewChat(chat, req.auth.userId) });
  } catch (err) {
    next(err);
  }
});

chatsRouter.get('/:chatId/messages', async (req, res, next) => {
  try {
    const chat = await memberChat(req.params.chatId, req.auth.userId);
    if (!chat) return res.status(404).json({ error: 'chat not found' });
    const docs = await Message.find({ chat: chat._id })
      .sort({ createdAt: -1, _id: -1 }).limit(100).lean();
    return res.status(200).json({ messages: docs.reverse().map(viewMessage) });
  } catch (err) {
    next(err);
  }
});

chatsRouter.post('/:chatId/messages', async (req, res, next) => {
  const raw = req.body?.message;
  if (typeof raw !== 'string' || raw.trim().length === 0 || raw.trim().length > 2000) {
    return res.status(400).json({ error: 'message must be 1-2000 characters' });
  }
  try {
    const chat = await memberChat(req.params.chatId, req.auth.userId);
    if (!chat) return res.status(404).json({ error: 'chat not found' });
    const doc = await Message.create({
      chat: chat._id,
      sender: req.auth.userId,
      message: raw.trim()
    });
    await Chat.updateOne({ _id: chat._id }, { $set: { updatedAt: doc.createdAt } });
    return res.status(201).json({ message: viewMessage(doc) });
  } catch (err) {
    next(err);
  }
});
