import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircleQuestion, 
  Send, 
  CheckCircle, 
  User, 
  ExternalLink,
  ArrowLeft,
  Eye,
  Clock,
  Hash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const AdminPreguntas = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(null);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/preguntas`);
        setPreguntas(res.data);
      } catch (error) {
        console.error("⚠ Error al traer preguntas:", error);
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
      setMensaje("⚠️ Ingresá una respuesta antes de enviarla.");
      return;
    }

    setEnviandoRespuesta(preguntaId);

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
      console.error("⚠ Error al responder pregunta:", error);
      setMensaje("❌ Error al enviar la respuesta. Inténtalo de nuevo.");
    } finally {
      setEnviandoRespuesta(null);
    }
  };

  // Agrupar preguntas por curso_id
  const preguntasPorCurso = preguntas.reduce((acc, p) => {
    if (!acc[p.curso_id]) acc[p.curso_id] = [];
    acc[p.curso_id].push(p);
    return acc;
  }, {});

  const totalPendientes = preguntas.filter(p => !p.respondida).length;
  const totalRespondidas = preguntas.filter(p => p.respondida).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-pink-600 flex items-center justify-center">
          <MessageCircleQuestion className="h-8 w-8 mr-3" />
          Panel de Preguntas Pendientes
        </h1>
        <p className="text-muted-foreground">
          Responde a las preguntas de los estudiantes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-800">{totalPendientes}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Respondidas</p>
                <p className="text-2xl font-bold text-green-800">{totalRespondidas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-800">{preguntas.length}</p>
              </div>
              <MessageCircleQuestion className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success/Error Message */}
      {mensaje && (
        <Alert className={mensaje.includes('éxito') ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
          <AlertDescription className={mensaje.includes('éxito') ? "text-green-700" : "text-orange-700"}>
            {mensaje}
          </AlertDescription>
        </Alert>
      )}

      {/* Questions by Course */}
      {Object.keys(preguntasPorCurso).length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageCircleQuestion className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay preguntas disponibles
            </h3>
            <p className="text-muted-foreground">
              Cuando los estudiantes hagan preguntas, aparecerán aquí para que puedas responderlas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(preguntasPorCurso).map(([cursoId, preguntasCurso]) => (
            <Card key={cursoId} className="shadow-lg border-l-4 border-l-pink-500">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-pink-600 flex items-center">
                    <Hash className="h-5 w-5 mr-2" />
                    {preguntasCurso[0].curso} 
                    <Badge variant="secondary" className="ml-3">
                      ID: {cursoId}
                    </Badge>
                  </CardTitle>
                  <Button
                    onClick={() => navigate(`/cursos/${cursoId}`)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-pink-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver curso
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {preguntasCurso.map((p) => (
                    <Card 
                      key={p.id} 
                      className={`transition-all duration-200 ${p.respondida ? 'bg-green-50 border-green-200' : 'bg-white hover:shadow-md'}`}
                    >
                      <CardContent className="p-4">
                        {/* Question */}
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {p.usuario?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-pink-700">{p.usuario}</span>
                              <span className="text-sm text-muted-foreground">preguntó:</span>
                              <Badge 
                                variant={p.respondida ? "default" : "secondary"}
                                className={p.respondida ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}
                              >
                                {p.respondida ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Respondida
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pendiente
                                  </>
                                )}
                              </Badge>
                            </div>
                            <p className="text-gray-800 leading-relaxed">{p.pregunta}</p>
                          </div>
                        </div>

                        {/* Response Section */}
                        {p.respondida ? (
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <div className="flex items-center mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                              <span className="font-semibold text-green-700">Tu respuesta:</span>
                            </div>
                            <p className="text-green-800 leading-relaxed">{p.respuesta}</p>
                          </div>
                        ) : (
                          <div className="space-y-3 pt-4 border-t border-gray-200">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="font-medium text-gray-700">Escribe tu respuesta:</span>
                            </div>
                            <Textarea
                              placeholder="Escribe una respuesta clara y útil para el estudiante..."
                              className="min-h-[100px] resize-none"
                              value={respuestas[p.id] || ""}
                              onChange={(e) =>
                                setRespuestas((prev) => ({
                                  ...prev,
                                  [p.id]: e.target.value,
                                }))
                              }
                            />
                            <div className="flex justify-end">
                              <Button
                                onClick={() => handleResponder(p.id)}
                                disabled={enviandoRespuesta === p.id || !respuestas[p.id]?.trim()}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {enviandoRespuesta === p.id ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Enviando...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Enviar respuesta
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPreguntas;