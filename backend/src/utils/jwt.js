import jwt from "jsonwebtoken";

export function signJwt(payload, secret, expiresIn="7d") {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt(token, secret) {
  return jwt.verify(token, secret);
}
