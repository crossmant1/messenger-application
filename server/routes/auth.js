import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { normalizedUsername, validNewPassword } from '../auth/input.js';
import { signAccessToken } from '../auth/token.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  const username = normalizedUsername(req.body?.username);
  const password = req.body?.password;
  if (username === null || validNewPassword(password) === false) {
    return res.status(400).json({ error: 'invalid registration input' });
  }
  try {

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, passwordHash });
    return res.status(201).json({ user: {
      id: user.id, username: user.username
    } });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'username unavailable' });
    }
    next(err);
  }
});

authRouter.post('/login', async (req, res, next) => {
  const username = normalizedUsername(req.body?.username);
  const password = req.body?.password;
  if (username === null || typeof password !== 'string'
      || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  try {
    const user = await User.findOne({ username })
      .select('+passwordHash');
    const valid = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;
    if (valid === false) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    return res.status(200).json({
      token: signAccessToken(user.id),
      tokenType: 'Bearer', expiresIn: 900,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    next(err);
  }
});