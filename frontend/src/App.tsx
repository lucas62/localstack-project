import React, { useEffect, useRef, useState } from "react";
import api from "./api";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<{ key: string; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    const res = await api.get("/files");
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo primeiro.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await api.post("/upload", formData);
    fetchFiles();

    // Limpar input e estado
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Upload de Arquivos</h1>
      <input type="file" ref={inputRef} onChange={handleChange} />
      <button style={{marginLeft: "1rem"}} onClick={handleUpload}>Enviar</button>

      <h2>Arquivos no Bucket</h2>
      <ul>
        {files.map((f) => (
          <li key={f.key}>
            {f.key} -{" "}
            <a href={`http://localhost:3001/download/${f.key}`} download>
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
