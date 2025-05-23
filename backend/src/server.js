import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import protectedRoutes from "./routes/protected.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/login", authRoutes);
app.use("/upload", fileRoutes);
app.use("/protected", protectedRoutes);

app.listen(3001, () => {
  console.log("✅ Backend rodando em http://localhost:3001");
});
