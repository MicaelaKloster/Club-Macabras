import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdminPreguntas = () => {
  const { usuario } = useAuth();
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({}); // objeto donde clave = preguntaId, valor = respuesta
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/preguntas`);
        setPreguntas(res.data);
      } catch (error) {
        console.error("❌ Error al traer preguntas:", error);
      }
    };

    if (usuario?.rol === "admin") {
      fetchPreguntas();
    }
  }, [usuario]);

  const handleResponder = async (preguntaId) => {
    const token = localStorage.getItem("token");
    const respuesta = respuestas[preguntaId];

    if (!respuesta || !respuesta.trim()) {
      return alert("⚠️ Ingresá una respuesta antes de enviarla.");
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/preguntas/${preguntaId}`,
        { respuesta },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("✅ Respuesta enviada con éxito");
      // Limpiamos la respuesta local y actualizamos lista
      setRespuestas((prev) => ({ ...prev, [preguntaId]: "" }));
      setPreguntas((prev) =>
        prev.map((p) =>
          p.id === preguntaId ? { ...p, respuesta, respondida: true } : p
        )
      );
    } catch (error) {
      console.error("❌ Error al responder pregunta:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-pink-800">Panel de Preguntas Pendientes</h1>

      {mensaje && <p className="text-green-600 font-semibold">{mensaje}</p>}

      {preguntas.length === 0 ? (
        <p className="text-gray-600">No hay preguntas disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {preguntas.map((p) => (
            <li key={p.id} className="border p-4 rounded shadow space-y-2">
              <p className="text-sm text-gray-600">Curso ID: {p.curso_id}</p>
              <p>
                <strong className="text-pink-700">{p.usuario} preguntó:</strong>{" "}
                {p.pregunta}
              </p>

              {p.respondida ? (
                <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded">
                  <p className="text-green-700 font-semibold">Respuesta:</p>
                  <p>{p.respuesta}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Escribí tu respuesta..."
                    value={respuestas[p.id] || ""}
                    onChange={(e) =>
                      setRespuestas((prev) => ({
                        ...prev,
                        [p.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleResponder(p.id)}
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                  >
                    Enviar respuesta
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPreguntas;