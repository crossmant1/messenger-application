import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { PrimerUser } from '../models/PrimerUser.js'; 
import { authRouter } from '../routes/auth.js';
import { chatsRouter } from '../routes/chats.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { attachChatSockets } from '../realtime/chatSockets.js';



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
attachChatSockets(io);
app.set('chatIo', io);

app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/chats', requireAuth, chatsRouter);

app.get('/api/ready', (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  return res.status(ready ? 200 : 503)
    .json({ status: ready ? 'ready' : 'unavailable' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'route not found' });
});

app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'invalid JSON' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'body too large' });
  }
  console.error(err);
  return res.status(500).json({ error: 'server error' });
});

const mongoUri = process.env.MONGODB_URI ??
  'mongodb://127.0.0.1:27018/capstone_notes_primer';

try {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  await PrimerUser.init();
  httpServer.listen(3000, '127.0.0.1', () => {
    console.log('Listening on http://127.0.0.1:3000');
  });
} catch (err) {
  console.error('MongoDB connection failed:', err.message);
  process.exitCode = 1;
}
