import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPreguntas = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
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

  // Agrupar preguntas por curso_id
  const preguntasPorCurso = preguntas.reduce((acc, p) => {
    if (!acc[p.curso_id]) acc[p.curso_id] = [];
    acc[p.curso_id].push(p);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-pink-800">Panel de Preguntas Pendientes</h1>

      {mensaje && <p className="text-green-600 font-semibold">{mensaje}</p>}

      {Object.keys(preguntasPorCurso).length === 0 ? (
        <p className="text-gray-600">No hay preguntas disponibles.</p>
      ) : (
        Object.entries(preguntasPorCurso).map(([cursoId, preguntasCurso]) => (
          <div
            key={cursoId}
            className="border border-pink-300 rounded p-4 bg-pink-50 space-y-3"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-pink-700">
                Curso ID: {preguntasCurso[0].curso} (ID: {cursoId})
              </h2>
              <button
                onClick={() => navigate(`/cursos/${cursoId}`)}
                className="text-sm text-blue-600 hover:underline"
              >
                🔍 Ver curso
              </button>
            </div>

            <ul className="space-y-4">
              {preguntasCurso.map((p) => (
                <li
                  key={p.id}
                  className="bg-white p-4 rounded shadow space-y-2 border"
                >
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
          </div>
        ))
      )}
    </div>
  );
};


export default AdminPreguntas;