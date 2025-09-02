import jwt from "jsonwebtoken";

/**
 * Auth middleware (supports Bearer token)
 * Attaches req.user = { id, name, email }
 */
export function auth(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, name: payload.name, email: payload.email };
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Backward compatibility aliases
export const requireAuth = auth;
export default auth;
