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

export function getNotes(signal) {
  return requestJson('/api/examples/notes', { signal });
}

export function createNote(text) {
  return requestJson('/api/examples/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
}