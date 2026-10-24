import test from 'node:test';
import assert from 'node:assert/strict';

test('health responds with 200 and JSON', async () => {
  const response = await fetch('http://127.0.0.1:3000/api/health');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});