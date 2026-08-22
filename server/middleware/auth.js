import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Please log in first" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "change-this-secret");
    next();
  } catch (error) {
    res.status(401).json({ message: "Your session has expired. Please log in again" });
  }
}