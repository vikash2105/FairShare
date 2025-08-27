import { verifyJwt } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = verifyJwt(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      isAnonymous: payload.isAnonymous,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
