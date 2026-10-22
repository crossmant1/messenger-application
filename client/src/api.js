async function requestJson(path, options = {}) {
  let response;
  try {
    response = await fetch(path, options);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Cannot reach the API');
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data;
}

// Temporary user-id handoff until login establishes a real session.
function userHeaders(userId) {
  return { 'X-User-Id': userId };
}

export async function login(username, password) {
  const data = await requestJson('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return data.user;
}

export function createAccount(username, password) {
  return requestJson('/api/create-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export function getChats(userId, signal) {
  return requestJson('/api/chats', { headers: userHeaders(userId), signal })
    .then((data) => data.chats);
}

export function createChat(userId, username) {
  return requestJson('/api/chats', {
    method: 'POST',
    headers: { ...userHeaders(userId), 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
}

export function getMessages(userId, chatId, signal) {
  return requestJson(`/api/chats/${encodeURIComponent(chatId)}/messages`, {
    headers: userHeaders(userId), signal,
  }).then((data) => data.messages);
}

export function sendMessage(userId, chatId, message) {
  return requestJson(`/api/chats/${encodeURIComponent(chatId)}/messages`, {
    method: 'POST',
    headers: { ...userHeaders(userId), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}

export function addMember(userId, chatId, username) {
  return requestJson(`/api/chats/${encodeURIComponent(chatId)}/members`, {
    method: 'POST',
    headers: { ...userHeaders(userId), 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
}
