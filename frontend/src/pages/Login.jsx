import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, contraseña }
      );

      login(data.usuario); // Guardamos en el contexto
      localStorage.setItem("token", data.token); // Guardamos token si querés
      console.log("Login exitoso", data.usuario);
      navigate("/"); // Redireccionamos al home
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            value={email}
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Contraseña</label>
          <input
            type="password"
            value={contraseña}
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-pink-700 text-white w-full py-2 rounded hover:bg-pink-800"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;