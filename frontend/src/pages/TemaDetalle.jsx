import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  MessageCircle, 
  User, 
  Calendar, 
  Send, 
  AlertTriangle,
  Loader2,
  MessageSquarePlus,
  Clock,
  Hash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";

const TemaDetalle = () => {
  const { id } = useParams();
  const [tema, setTema] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const navigate = useNavigate();

  const fetchTema = async () => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/temas-foro/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTema(data);
    } catch (error) {
      console.error("⚠ Error al obtener el tema:", error);
      setError("Error al cargar el tema.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTema();
  }, [id]);

  const handleRespuestaSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviandoRespuesta(true);

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/temas-foro/${id}/respuestas`,
        { contenido: respuesta },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRespuesta("");
      await fetchTema(); // Recargamos el tema con las respuestas actualizadas
    } catch (err) {
      console.error("⚠ Error al enviar respuesta:", err);
      setError(err.response?.data?.error || "No se pudo enviar la respuesta.");
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const caracteresRestantes = 1000 - respuesta.length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !tema) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <AlertTriangle className="h-16 w-16 mx-auto text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Error al cargar el tema
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate("/foro")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al foro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tema) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Tema no encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              El tema que buscas no existe o fue eliminado.
            </p>
            <Button onClick={() => navigate("/foro")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al foro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver atrás
        </Button>
      </div>

      {/* Main Topic Card */}
      <Card className="shadow-lg border-l-4 border-l-pink-500">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-pink-600 mb-3 leading-tight">
                {tema.tema}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {tema.nombre || "Desconocido"}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatearFecha(tema.fecha)}
                </div>
                <div className="flex items-center">
                  <Hash className="h-4 w-4 mr-1" />
                  ID: {tema.id}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-pink-100 text-pink-600">
              <MessageCircle className="h-3 w-3 mr-1" />
              {tema.respuestas?.length || 0} respuestas
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {tema.contenido}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Responses Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-pink-600 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Respuestas ({tema.respuestas?.length || 0})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {!tema.respuestas || tema.respuestas.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 italic">Aún no hay respuestas.</p>
              <p className="text-sm text-gray-500 mt-1">
                ¡Sé el primero en participar en esta conversación!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tema.respuestas.map((resp, index) => (
                <div key={resp.id} className="relative">
                  <Card className="bg-gray-50 hover:bg-gray-100 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {resp.nombre?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{resp.nombre || "Usuario"}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatearFecha(resp.fecha)}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {resp.contenido}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700 flex items-center">
            <MessageSquarePlus className="h-5 w-5 mr-2" />
            Responder al tema
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRespuestaSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Escribe tu respuesta aquí. Sé respetuoso y constructivo..."
                className="min-h-[120px] resize-none"
                maxLength={1000}
                required
              />
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">
                  Participa de forma constructiva y respetuosa
                </p>
                <span className={`${caracteresRestantes < 50 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {caracteresRestantes} caracteres restantes
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={enviandoRespuesta || !respuesta.trim()}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
              >
                {enviandoRespuesta ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemaDetalle;