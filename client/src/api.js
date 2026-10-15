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


export function login(username, password){

    return requestJson('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({username, password})
    });
}

export function createAccount(username, password){
        return requestJson('/api/create-account', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({username, password})
    });


}