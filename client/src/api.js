async function requestJson(path, options = {}) {
  let response;
  try {
    response = await fetch(path, options);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Cannot reach the API');
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`API returned invalid JSON (HTTP ${response.status})`);
  }
  if (response.ok === false) {
    throw new Error(data.error ?? `HTTP ${response.status}`);
  }
  return data;
}


export async function login(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok === false) {
    throw new Error(data.error ?? 'Login failed');
  }

  return data.token;
}

export function createAccount(username, password){
        return requestJson('/api/create-account', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({username, password})
    });


}

export async function createChat(username, message) {
  const response = await fetch('/api/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, message }),
  });

  if (!response.ok) {
    throw new Error(`Could not create chat (${response.status}).`);
  }

  return response.status === 204 ? null : response.json();
}

//exmaple: 
// export async function loadPrivateNotes(token) {
//   const response = await fetch('/api/private/notes', {
//     headers: { Authorization: `Bearer ${token}` }
//   });

//   if (response.ok === false) {
//     throw new Error(`Private GET failed: ${response.status}`);
//   }

//   return (await response.json()).notes;
// }