export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function requestJson(path, { token, method = 'GET', body, signal } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
let response;
try {
  response = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal
  });
} catch (err) {
  if (err.name === 'AbortError') throw err;
  throw new ApiError('Cannot reach the API', 0);
}
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(`Invalid API JSON (HTTP ${response.status})`, response.status);
  }
  if (!response.ok) {
    throw new ApiError(data.error ?? `HTTP ${response.status}`, response.status);
  }
  return data;
}
export function login(username, password) {
  return requestJson('/api/auth/login', {
    method: 'POST', body: { username, password }
  });
}

export function register(username, password) {
  return requestJson('/api/auth/register', {
    method: 'POST', body: { username, password }
  });
}

export function listChats(token, signal) {
  return requestJson('/api/chats', { token, signal });
}

export function createChat(token, username) {
  return requestJson('/api/chats', {
    token, method: 'POST', body: { username }
  });
}

export function addChatParticipant(token, chatId, username) {
  return requestJson(`/api/chats/${encodeURIComponent(chatId)}/participants`, {
    token, method: 'POST', body: { username }
  });
}

export function listMessages(token, chatId, signal) {
  return requestJson(`/api/chats/${encodeURIComponent(chatId)}/messages`, {
    token, signal
  });
}

export function postMessage(token, chatId, message) {
  return requestJson(`/api/chats/${encodeURIComponent(chatId)}/messages`, {
    token, method: 'POST', body: { message }
  });
}
