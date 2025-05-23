import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import "./Auth.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 style={{ marginBottom: "1rem" }}>🏠 Bem-vindo à Home!</h1>
        <p>Você está logado com sucesso.</p>
        <button onClick={handleLogout} style={{ marginTop: "1.5rem" }}>
          Sair
        </button>
      </div>
    </div>
  );
}
