import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NuevoTema = () => {
  const [tema, setTema] = useState("");
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/temas-foro`,
        { tema, contenido },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/foro");
    } catch (err) {
      console.error("❌ Error al crear tema:", err);
      setError("No se pudo publicar el tema");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-pink-800 mb-4">Nuevo Tema</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Título del tema</label>
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Contenido</label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
            rows="5"
          ></textarea>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/foro")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800"
          >
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoTema;