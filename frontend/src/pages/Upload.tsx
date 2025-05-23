import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Auth.css";

type FileInfo = {
  key: string;
  url: string;
};

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await axios.get<FileInfo[]>("http://localhost:3001/upload");
      setFiles(res.data);
    } catch {
      setError("Erro ao carregar arquivos.");
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const upload = async () => {
    if (!file) {
      setError("Selecione um arquivo para enviar.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:3001/upload", formData);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      await delay(300); // pequeno delay para garantir que o S3 atualizou
      await fetchFiles();
    } catch (err) {
      setError("Erro ao enviar o arquivo.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{maxWidth: '60%'}}>
        <h2>Upload de Arquivos</h2>

        <input
          type="file"
          ref={inputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ marginBottom: "0.75rem" }}
        />

        {error && <p className="auth-error">{error}</p>}

        <button onClick={upload}>Enviar</button>

        <ul style={{ marginTop: "1rem", paddingLeft: "1rem", textAlign: "left" }}>
          {files.map((f) => (
            <li key={f.key} style={{ marginBottom: "0.5rem" }}>
              {f.key} —{" "}
              <a href={f.url} download style={{ color: "#1976d2" }}>
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
