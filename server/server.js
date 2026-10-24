import express from 'express';
import mongoose from 'mongoose';
import { Note } from '../models/Note.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { attachStudySockets } from '../realtime/studySockets.js';
import { PrimerUser } from '../models/PrimerUser.js'; 
import { authRouter } from '../routes/auth.js';



const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);
attachStudySockets(io);
app.set('studyIo', io);

app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

function noteView(doc) {
  return {
    id: doc._id.toString(),
    text: doc.text,
    createdAt: doc.createdAt
  };
}

// Add the GET, POST, and error handlers here
app.use('/api/auth', authRouter);

app.get('/api/ready', (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  return res.status(ready ? 200 : 503)
    .json({ status: ready ? 'ready' : 'unavailable' });
});

app.get('/api/examples/notes', async (_req, res, next) => {
  try {
    const docs = await Note.find()
      .sort({ createdAt: -1, _id: -1 })
      .limit(50)
      .lean();
    return res.status(200).json({
      notes: docs.map(noteView)
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/examples/notes', async (req, res, next) => {
  const raw = req.body?.text;
  if (typeof raw !== 'string') {
    return res.status(400).json({ error: 'invalid text' });
  }
  const text = raw.trim();
  if (text.length === 0 || text.length > 280) {
    return res.status(400).json({ error: 'invalid text' });
  }
  try {
    const doc = await Note.create({ text });
    return res.status(201).json({ note: noteView(doc) });
  } catch (err) {
    next(err);
  }
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