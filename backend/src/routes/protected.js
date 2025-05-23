import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secreto123";

router.get("/check", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Token válido", user: decoded.email });
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
});

export default router;
