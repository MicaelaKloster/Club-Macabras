import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registro = () => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [provincia, setProvincia] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/usuarios`, {
                nombre,
                email,
                contraseña,
                provincia,
                ciudad
            });

            setMensaje("Registro exitoso. Ahora puedes iniciar sesión.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.error("❌ Error al registrar:", err);
            setError(err.response?.data?.error || "Hubo un problema al registrarse");
        }
    };

     return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-pink-800">
        Crear una cuenta
      </h2>

      {error && <p className="text-red-600 text-center mb-2">{error}</p>}
      {mensaje && <p className="text-green-600 text-center mb-2">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Provincia</label>
          <input
            type="text"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Ciudad</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-pink-700 text-white w-full py-2 rounded hover:bg-pink-800"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Registro;