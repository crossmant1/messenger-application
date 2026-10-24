import jwt from 'jsonwebtoken';

//const secret = process.env.JWT_SECRET;
const secret = "2b96dad9677511f5204a1828b9619528573308df9b4f36040a4023c270c8e615"

if (typeof secret !== 'string'
    || /^[0-9a-f]{64}$/i.test(secret) === false) {
  throw new Error('JWT_SECRET must be 64 random hex characters');
}

const settings = {
  algorithm: 'HS256',
  issuer: 'messenger-application',
  audience: 'messenger-api'
};

export function signAccessToken(userId) {
  return jwt.sign({}, secret, {
    ...settings, subject: userId.toString(), expiresIn: '15m'
  });
}

export function verifyAccessToken(token) {
  const claims = jwt.verify(token, secret, {
    algorithms: ['HS256'],
    issuer: settings.issuer,
    audience: settings.audience,
    clockTolerance: 5
  });
  if (typeof claims !== 'object'
      || typeof claims.sub !== 'string'
      || /^[0-9a-f]{24}$/i.test(claims.sub) === false
      || typeof claims.exp !== 'number') {
    throw new Error('invalid token claims');
  }
  return claims.sub;
}