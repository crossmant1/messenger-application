import express from 'express';
import mongoose from 'mongoose';
import User from './models/User.js';

const app = express();
app.use(express.json({ limit: '16kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});


// Add the GET, POST, and error handlers here.

app.post('/api/create-account', async (_req, res) => {

  const { username, password } = _req.body;

  if (!username || !password){
    return res.status(400).json({error: 'Username and password are required.'});
  }

  if (await User.findOne({ username })){
    return res.status(409).json({ error: 'Username is already taken.'});
  }

  await User.create({username, password});

  return res.status(201).json({ message: 'Account created sucessfully.'});
});

app.post('/api/login', async (_req, res) => {

  const { username, password } = _req.body;

  if (!username || !password){
    return res.status(400).json({error: 'Username and password are required.'});
  }

  const user = await User.findOne({username})
  if(!user || !(await user.comparePassword(password))){
    return res.status(401).json({error: 'Invalid username or password.'});
  }

  return res.status(200).json({message: 'Login succeeded.'});
});



app.get('/api/chats', (_req, res) => {
  res.status(200).json({ chats });
});

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
  app.listen(3000, '127.0.0.1', () => {
    console.log('Listening on http://127.0.0.1:3000');
  });
} catch (err) {
  console.error('MongoDB connection failed:', err.message);
  process.exitCode = 1;
}