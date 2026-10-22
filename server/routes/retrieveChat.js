import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

export const chatRouter = Router();

function viewChat(chat) {
  return {
    id: chat._id.toString(),
    chat: chat.chatName || 'Private chat',
    isGroupChat: chat.isGroupChat,
    participants: chat.participants,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  };
}

function viewMessage(message) {
  return {
    id: message._id.toString(),
    sender: message.sender,
    message: message.message,
    createdAt: message.createdAt,
  };
}

// Prototype only: replace X-User-Id with req.user.id from authenticated middleware.
chatRouter.use((req, res, next) => {
  const userId = req.get('X-User-Id');
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(401).json({ error: 'Current user is required.' });
  }
  req.currentUserId = userId;
  next();
});

async function memberChat(req, res) {
  const { chatId } = req.params;
  if (!mongoose.isValidObjectId(chatId)) {
    res.status(400).json({ error: 'Invalid chat ID.' });
    return null;
  }
  const chat = await Chat.findOne({ _id: chatId, participants: req.currentUserId });
  if (!chat) {
    res.status(404).json({ error: 'Chat not found.' });
    return null;
  }
  return chat;
}

chatRouter.get('/', async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.currentUserId })
      .populate('participants', 'username')
      .sort({ updatedAt: -1 });
    return res.json({ chats: chats.map(viewChat) });
  } catch (err) {
    next(err);
  }
});

chatRouter.post('/', async (req, res, next) => {
  try {
    const username = req.body.username?.trim();
    if (!username) return res.status(400).json({ error: 'Username is required.' });
    const recipient = await User.findOne({ username });
    if (!recipient) return res.status(404).json({ error: 'User not found.' });
    if (recipient._id.toString() === req.currentUserId) {
      return res.status(400).json({ error: 'Choose another user.' });
    }

    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [req.currentUserId, recipient._id], $size: 2 },
    });
    const created = !chat;
    if (!chat) {
      chat = await Chat.create({
        chatID: randomUUID(),
        chatOwner: req.currentUserId,
        participants: [req.currentUserId, recipient._id],
        isGroupChat: false,
      });
    }
    await chat.populate('participants', 'username');
    return res.status(created ? 201 : 200).json({ chat: viewChat(chat) });
  } catch (err) {
    next(err);
  }
});

chatRouter.get('/:chatId', async (req, res, next) => {
  try {
    const chat = await memberChat(req, res);
    if (!chat) return;
    await chat.populate('participants', 'username');
    return res.json({ chat: viewChat(chat) });
  } catch (err) {
    next(err);
  }
});

chatRouter.get('/:chatId/messages', async (req, res, next) => {
  try {
    const chat = await memberChat(req, res);
    if (!chat) return;
    const messages = await Message.find({ chat: chat._id })
      .populate('sender', 'username')
      .sort({ createdAt: 1, _id: 1 });
    return res.json({ messages: messages.map(viewMessage) });
  } catch (err) {
    next(err);
  }
});

chatRouter.post('/:chatId/messages', async (req, res, next) => {
  try {
    const chat = await memberChat(req, res);
    if (!chat) return;
    const text = req.body.message?.trim();
    if (!text) return res.status(400).json({ error: 'Message is required.' });
    const message = await Message.create({
      chat: chat._id,
      sender: req.currentUserId,
      message: text,
    });
    await message.populate('sender', 'username');
    await Chat.updateOne({ _id: chat._id }, { $set: { updatedAt: new Date() } });
    return res.status(201).json({ message: viewMessage(message) });
  } catch (err) {
    next(err);
  }
});

chatRouter.post('/:chatId/members', async (req, res, next) => {
  try {
    const chat = await memberChat(req, res);
    if (!chat) return;
    const username = req.body.username?.trim();
    if (!username) return res.status(400).json({ error: 'Username is required.' });
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (chat.participants.some((id) => id.equals(user._id))) {
      return res.status(409).json({ error: 'User is already in this chat.' });
    }
    if (!chat.isGroupChat) {
      chat.isGroupChat = true;
      chat.chatName = 'Group chat';
    }
    chat.participants.push(user._id);
    await chat.save();
    await chat.populate('participants', 'username');
    return res.json({ chat: viewChat(chat) });
  } catch (err) {
    next(err);
  }
});
