import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { setToken } from "../utils/auth";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setError("");
  };

  const handleAuth = async () => {
    try {
      setError("");

      if (!email || !password) {
        setError("Preencha todos os campos.");
        return;
      }

      if (!isLoginRoute && password !== repeatPassword) {
        setError("As senhas não coincidem.");
        return;
      }

      if (isLoginRoute) {
        const res = await axios.post("http://localhost:3001/login", { email, password });
        setToken(res.data.token);
        alert(res.data.message || "Login realizado com sucesso.");
        reset();
        navigate("/home");
      } else {
        const res = await axios.post("http://localhost:3001/login/register", { email, password });
        alert(res.data.message || "Cadastro realizado com sucesso.");
        reset();
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao autenticar.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLoginRoute ? "Entrar na conta" : "Criar nova conta"}</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLoginRoute && (
          <input
            type="password"
            placeholder="Repetir senha"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        )}
        {error && <p className="auth-error">{error}</p>}
        <button onClick={handleAuth}>
          {isLoginRoute ? "Entrar" : "Cadastrar"}
        </button>
        <button
          className="ghost"
          onClick={() => {
            reset();
            navigate(isLoginRoute ? "/register" : "/login");
          }}
        >
          {isLoginRoute ? "Criar conta" : "Voltar"}
        </button>
      </div>
    </div>
  );
}
