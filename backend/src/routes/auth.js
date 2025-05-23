import express from "express";
import jwt from "jsonwebtoken";
import { findUser, createUser } from "../services/db.js";
import { hashPassword, comparePasswords } from "../services/utils.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secreto123";

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const existing = await findUser(email);
  if (existing) return res.status(400).json({ error: "Usuário já existe" });

  const hashed = await hashPassword(password);
  await createUser(email, hashed);
  res.json({ message: "Usuário criado com sucesso" });
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser(email);
  if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

  const valid = await comparePasswords(password, user.password);
  if (!valid) return res.status(401).json({ error: "Senha inválida" });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login bem-sucedido", token });
});

export default router;
