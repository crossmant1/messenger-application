import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../auth/token.js';
import Chat from '../models/Chat.js';

const idPattern = /^[0-9a-f]{24}$/i;

export function chatRoom(chatId) {
  return `chat:${chatId}`;
}

export function attachChatSockets(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (typeof token !== 'string') throw new Error('missing token');
      const userId = verifyAccessToken(token);
      const claims = jwt.decode(token);
      if (typeof claims?.exp !== 'number') throw new Error('missing expiry');
      socket.data.userId = userId;
      socket.data.expiresAt = claims.exp * 1000;
      next();
    } catch {
      next(new Error('authentication required'));
    }
  });

  io.on('connection', socket => {
    const expiryTimer = setTimeout(() => socket.disconnect(true),
      Math.max(0, socket.data.expiresAt - Date.now()));
    socket.on('disconnect', () => clearTimeout(expiryTimer));

    socket.on('chat:join', async (payload, acknowledge) => {
      if (typeof acknowledge !== 'function') return;
      const chatId = payload?.chatId;
      if (typeof chatId !== 'string' || !idPattern.test(chatId)) {
        acknowledge({ ok: false, code: 'not_found' });
        return;
      }
      try {
        const chat = await Chat.findOne({
          _id: chatId,
          participants: socket.data.userId
        }).select('_id').lean();
        if (!chat) {
          acknowledge({ ok: false, code: 'not_found' });
          return;
        }
        await socket.join(chatRoom(chatId));
        acknowledge({ ok: true, chatId });
      } catch {
        acknowledge({ ok: false, code: 'server_error' });
      }
    });

    socket.on('chat:leave', (payload, acknowledge) => {
      const chatId = payload?.chatId;
      if (typeof chatId !== 'string' || !idPattern.test(chatId)) {
        if (typeof acknowledge === 'function') {
          acknowledge({ ok: false, code: 'not_found' });
        }
        return;
      }
      socket.leave(chatRoom(chatId));
      if (typeof acknowledge === 'function') acknowledge({ ok: true });
    });
  });
}
