import express from "express";
import multer from "multer";
import fs from "fs";
import s3 from "../services/s3.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();
const BUCKET = process.env.BUCKET_NAME;

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("Nenhum arquivo enviado.");

  const fileStream = fs.createReadStream(file.path);
  const uniqueKey = `${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: BUCKET,
    Key: uniqueKey,
    Body: fileStream,
  };

  try {
    await s3.upload(params).promise();
    fs.unlinkSync(file.path);
    res.send("Upload completo.");
  } catch (err) {
    console.error("Erro no upload:", err);
    res.status(500).send("Erro no upload.");
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
    const files = data.Contents.map((obj) => ({
      key: obj.Key,
      url: `${process.env.S3_ENDPOINT}/${BUCKET}/${obj.Key}`,
    }));
    res.json(files);
  } catch (err) {
    console.error("Erro ao listar arquivos:", err);
    res.status(500).send("Erro ao listar arquivos.");
  }
});

export default router;
