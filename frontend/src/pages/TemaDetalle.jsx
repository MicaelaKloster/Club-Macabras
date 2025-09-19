import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  Hash,
  MoreVertical,
  Edit3,
  Trash2,
  Save,
  X,
  Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

const TemaDetalle = () => {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [tema, setTema] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [editandoRespuesta, setEditandoRespuesta] = useState(null);
  const [respuestaEditable, setRespuestaEditable] = useState("");
  const [procesandoAccion, setProcesandoAccion] = useState(null);
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
    
    if (respuesta.length < 5 || respuesta.length > 2000) {
      setError("La respuesta debe tener entre 5 y 2000 caracteres");
      return;
    }
    
    setEnviandoRespuesta(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/temas-foro/${id}/respuestas`,
        { contenido: respuesta.trim() },
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

  const iniciarEdicionRespuesta = (resp) => {
    setEditandoRespuesta(resp.id);
    setRespuestaEditable(resp.contenido);
  };

  const cancelarEdicionRespuesta = () => {
    setEditandoRespuesta(null);
    setRespuestaEditable("");
  };

  const guardarEdicionRespuesta = async (respuestaId) => {
    if (respuestaEditable.length < 5 || respuestaEditable.length > 2000) {
      setError("La respuesta debe tener entre 5 y 2000 caracteres");
      return;
    }

    const token = localStorage.getItem("token");
    setProcesandoAccion(respuestaId);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/respuestas/${respuestaId}`,
        { contenido: respuestaEditable.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditandoRespuesta(null);
      setRespuestaEditable("");
      await fetchTema();
    } catch (error) {
      console.error("⚠ Error al editar respuesta:", error);
      setError("Error al actualizar la respuesta");
    } finally {
      setProcesandoAccion(null);
    }
  };

  const eliminarRespuesta = async (respuestaId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta respuesta? Esta acción no se puede deshacer.")) {
      return;
    }

    const token = localStorage.getItem("token");
    setProcesandoAccion(respuestaId);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/respuestas/${respuestaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchTema();
    } catch (error) {
      console.error("⚠ Error al eliminar respuesta:", error);
      setError("Error al eliminar la respuesta");
    } finally {
      setProcesandoAccion(null);
    }
  };

  const puedeModificarRespuesta = (respuesta) => {
    return usuario?.id === respuesta.usuario_id || usuario?.rol === 'admin';
  };

  const puedeModificarTema = (tema) => {
    return usuario?.id === tema.usuario_id || usuario?.rol === 'admin';
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

  const caracteresRestantes = 2000 - respuesta.length;
  const caracteresEditables = respuestaEditable ? 2000 - respuestaEditable.length : 2000;

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
          onClick={() => navigate("/foro")}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al foro
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
                  {usuario?.id === tema.usuario_id && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Tuyo
                    </Badge>
                  )}
                  {usuario?.rol === 'admin' && usuario?.id !== tema.usuario_id && (
                    <Crown className="h-3 w-3 ml-1 text-yellow-600" title="Puedes moderar" />
                  )}
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
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-pink-100 text-pink-600">
                <MessageCircle className="h-3 w-3 mr-1" />
                {tema.respuestas?.length || 0} respuestas
              </Badge>

              {/* Menu de opciones para el tema */}
              {puedeModificarTema(tema) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/foro/${tema.id}/editar`)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Editar tema
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
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
                            <p className="font-medium text-gray-800">
                              {resp.nombre || "Usuario"}
                              {usuario?.id === resp.usuario_id && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Tuyo
                                </Badge>
                              )}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatearFecha(resp.fecha)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          
                          {/* Menu de opciones para respuestas */}
                          {puedeModificarRespuesta(resp) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  disabled={procesandoAccion === resp.id}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => iniciarEdicionRespuesta(resp)}
                                  disabled={procesandoAccion === resp.id}
                                >
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Editar respuesta
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => eliminarRespuesta(resp.id)}
                                  disabled={procesandoAccion === resp.id}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar respuesta
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                      
                      {/* Contenido de respuesta o formulario de edición */}
                      {editandoRespuesta === resp.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={respuestaEditable}
                            onChange={(e) => setRespuestaEditable(e.target.value)}
                            className="min-h-[80px] text-sm"
                            maxLength={2000}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Editando respuesta</span>
                            <span>{caracteresEditables} caracteres restantes</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => guardarEdicionRespuesta(resp.id)}
                              disabled={procesandoAccion === resp.id || respuestaEditable.length < 5}
                              className="flex-1"
                            >
                              {procesandoAccion === resp.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Save className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelarEdicionRespuesta}
                              disabled={procesandoAccion === resp.id}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {resp.contenido}
                        </p>
                      )}
                      
                      {procesandoAccion === resp.id && (
                        <div className="flex items-center justify-center mt-2 p-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm text-muted-foreground">Procesando...</span>
                        </div>
                      )}
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
                maxLength={2000}
                required
              />
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">
                  Participa de forma constructiva y respetuosa (mínimo 5 caracteres)
                </p>
                <span className={`${caracteresRestantes < 100 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {caracteresRestantes} caracteres restantes
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={enviandoRespuesta || respuesta.length < 5}
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