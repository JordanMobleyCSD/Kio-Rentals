import jwt from "jsonwebtoken";

export function signToken(payload) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.verify(token, secret);
}

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    const cookieToken = req.cookies?.token;
    const finalToken = token || cookieToken;
    if (!finalToken) return res.status(401).json({ error: "Unauthorized", message: "Missing token" });

    const decoded = verifyToken(finalToken);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
  }
}
