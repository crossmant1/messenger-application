import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();
app.use(express.json({ limit: '16kb' }));
const notes = [];

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Add the GET, POST, and error handlers here.
app.get('/api/examples/notes', (_req, res) => {
  res.status(200).json({ notes });
});

app.listen(3000, '127.0.0.1', () => {
  console.log('Listening on http://127.0.0.1:3000');
});
