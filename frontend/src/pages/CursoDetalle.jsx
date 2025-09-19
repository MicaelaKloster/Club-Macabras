import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Lock, 
  Crown, 
  FileText, 
  MessageSquare, 
  Send, 
  Eye, 
  Calendar,
  User,
  Loader2,
  ExternalLink,
  AlertCircle,
  CreditCard,
  Edit3, 
  Trash2, 
  X, 
  Check, 
  MoreVertical
} from "lucide-react";

const CursoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [videos, setVideos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membresiaActiva, setMembresiaActiva] = useState(false);
  const [cursoInfo, setCursoInfo] = useState({ titulo: "", categoria: ""});
  const [videosVistos, setVideosVistos] = useState([]);
  const [porcentajeAvance, setPorcentajeAvance] = useState(0);
  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [precioMembresia, setPrecioMembresia] = useState(2000);
  const [editandoPregunta, setEditandoPregunta] = useState(null);
  const [preguntaEditada, setPreguntaEditada] = useState("");
  const [editandoRespuesta, setEditandoRespuesta] = useState(null);
  const [respuestaEditada, setRespuestaEditada] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchMateriales = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/cursos/${id}/materiales`,
          {
            headers: { 
              Authorization: `Bearer ${token}` 
            },
          }
        );

        setVideos(res.data.videos || []);
        setDocumentos(res.data.documentos || []);
      } catch (error) {
        console.error("Error al cargar materiales:", error.response?.data || error.message);
        setVideos([]);      
        setDocumentos([]); 
      } finally {
        setLoading(false);
      }
    };

    const verificarMembresia = async () => {
      if (usuario?.rol === 'admin') {
        setMembresiaActiva(true);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/membresias/${usuario.id}`,
          {
            headers: { 
              Authorization: `Bearer ${token}` 
            },
          }
        );
        setMembresiaActiva(res.data.activa);
      } catch (error) {
        console.error("Error al verificar membresía:", error);
        setMembresiaActiva(false);
      }
    };

    const obtenerCurso = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/cursos/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });

        setCursoInfo({
          titulo: res.data.titulo,
          categoria: res.data.categoria || "Sin categoría",
        });
      } catch (error) {
        console.error("Error al obtener datos del curso:", error);
        setCursoInfo({ titulo: "Curso no encontrado", categoria: "" });
      }
    };

    const obtenerProgreso = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/usuarios/${usuario.id}/progreso/${id}`,
          {
            headers: { 
              Authorization: `Bearer ${token}` 
            },
          }
        );
        setVideosVistos(res.data.vistos || []);
      } catch (error) {
        console.error("Error al obtener progreso:", error);
        setVideosVistos([]);
      }
    };

    const obtenerPrecioMembresia = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/info-extra/precio-membresia`
        );
        setPrecioMembresia(res.data.precio_membresia);
      } catch (error) {
        console.error("Error al obtener precio:", error);
      }
    };

    if (videos.length > 0 && videosVistos.length > 0) {
      const vistos = videos.filter((v) => videosVistos.includes(v.id)).length;
      const porcentaje = Math.round((vistos / videos.length) * 100);
      setPorcentajeAvance(porcentaje);
    } else {
      setPorcentajeAvance(0);
    }

    if (usuario) {
      fetchMateriales();
      verificarMembresia();
      obtenerCurso();
      obtenerProgreso();
      fetchPreguntas();
      obtenerPrecioMembresia();
    }

  }, [id, usuario, videos, videosVistos]);

  const marcarComoVisto = async (videoId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/progreso`,
        {
          video_id: videoId,
          curso_id: id
        },
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        }
      );

      setVideosVistos((prev) => [...prev, videoId]);
    } catch (error) {
      console.error("Error al marcar como visto:", error);
    }
  };

  const fetchPreguntas = async () => {
    const token = localStorage.getItem("token");

    try{
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/preguntas/curso/${id}`,
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        }
      );
      setPreguntas(res.data || []);
    } catch (error) {
      console.error("Error al obtener preguntas: ", error);
    }
  };

  const enviarPregunta = async () => {
    const token = localStorage.getItem("token");

    if(!nuevaPregunta.trim()) return;

    try{
      await axios.post(
        `${import.meta.env.VITE_API_URL}/preguntas`,
        {
          curso_id: id,
          pregunta: nuevaPregunta.trim(),
        },
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        }
      );
      setNuevaPregunta("");
      fetchPreguntas();
    } catch (error){
      console.error("Error al enviar pregunta: ", error.response?.data || error.message);
    }
  };

  const handleEditarPregunta = async (preguntaId) => {
    const token = localStorage.getItem("token");
    
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/preguntas/${preguntaId}/editar`,
        { pregunta: preguntaEditada },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditandoPregunta(null);
      setPreguntaEditada("");
      await fetchPreguntas();
    } catch (err) {
      console.error("Error al editar pregunta:", err);
      alert(err.response?.data?.error || "No se pudo editar la pregunta.");
    }
  };

  const handleEliminarPregunta = async (preguntaId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      return;
    }

    const token = localStorage.getItem("token");
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/preguntas/${preguntaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchPreguntas();
    } catch (err) {
      console.error("Error al eliminar pregunta:", err);
      alert(err.response?.data?.error || "No se pudo eliminar la pregunta.");
    }
  };

  const handleEditarRespuesta = async (preguntaId) => {
    const token = localStorage.getItem("token");
    
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/preguntas/${preguntaId}/editar-respuesta`,
        { respuesta: respuestaEditada },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditandoRespuesta(null);
      setRespuestaEditada("");
      await fetchPreguntas();
    } catch (err) {
      console.error("Error al editar respuesta:", err);
      alert(err.response?.data?.error || "No se pudo editar la respuesta.");
    }
  };

  const iniciarEdicionPregunta = (pregunta) => {
    setEditandoPregunta(pregunta.id);
    setPreguntaEditada(pregunta.pregunta);
  };

  const iniciarEdicionRespuesta = (pregunta) => {
    setEditandoRespuesta(pregunta.id);
    setRespuestaEditada(pregunta.respuesta || "");
  };

  const responderPregunta = async (preguntaId, respuesta) => {
    const token = localStorage.getItem("token");
    
    try{
      await axios.put(
        `${import.meta.env.VITE_API_URL}/preguntas/${preguntaId}/responder`,
        { respuesta },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPreguntas();
    }catch (error){
      console.error("Error al responder pregunta: ", error);
    }
  };

  const comprarMembresia = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/mercadopago/preferencia`,
        {
          usuario_id: usuario.id,
          precio: precioMembresia
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      window.location.href = `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${res.data.id}`;
    } catch (error) {
      console.error("Error al iniciar pago:", error.response?.data || error.message);
      alert("Ocurrió un error al iniciar el pago. Intenta nuevamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando materiales...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a cursos
        </Button>
      </div>

      {/* Información del curso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{cursoInfo.categoria}</Badge>
            {usuario?.rol === 'admin' && (
              <Badge variant="outline" className="gap-1">
                <Crown className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
          <CardTitle className="text-3xl">{cursoInfo.titulo}</CardTitle>
          
          {/* Estado de membresía */}
          {usuario?.rol !== 'admin' && (
            <div className="pt-4">
              {membresiaActiva ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    ✅ Tienes una membresía activa - Acceso completo al contenido
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <p>❌ No tienes una membresía activa para acceder al contenido premium</p>
                      <Button onClick={comprarMembresia} className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Comprar Membresía (${precioMembresia})
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {usuario?.rol === 'admin' && (
            <Alert className="border-blue-200 bg-blue-50">
              <Crown className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Acceso de administrador:</strong> Tienes acceso completo a todos los contenidos.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        
        {membresiaActiva && (
          <CardContent>
            <div className="space-y-4">
              <Button
                className={videosVistos.length > 0 ? "opacity-50" : ""}
                disabled={videosVistos.length > 0}
                onClick={() => {
                  if(videosVistos.length === 0){
                    alert("¡Curso comenzado!");
                  }
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                {videosVistos.length > 0 ? 'Curso en progreso' : 'Comenzar Curso'}
              </Button>

              {videos.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progreso del curso</span>
                    <span>{porcentajeAvance}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${porcentajeAvance}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Videos del Curso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <p className="text-muted-foreground italic">No hay videos disponibles para este curso.</p>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => {
                const obtenerUrlEmbed = (url) => {
                  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
                  const match = url.match(regex);
                  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
                };

                const urlEmbed = obtenerUrlEmbed(video.url);
                const puedeVerVideo = video.es_gratuito || membresiaActiva;

                return (
                  <Card key={video.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{video.titulo}</CardTitle>
                        <div className="flex items-center gap-2">
                          {video.es_gratuito && (
                            <Badge variant="secondary">Gratis</Badge>
                          )}
                          {!puedeVerVideo && (
                            <Badge variant="destructive" className="gap-1">
                              <Lock className="h-3 w-3" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {puedeVerVideo && urlEmbed ? (
                        <div className="space-y-4">
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <iframe
                              src={urlEmbed}
                              title={video.titulo}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            {videosVistos.includes(video.id) ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Completado</span>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => marcarComoVisto(video.id)}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Marcar como visto
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-12 bg-muted/50 rounded-lg">
                          <div className="text-center space-y-2">
                            <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
                            <p className="text-muted-foreground">
                              Contenido exclusivo para miembros
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos y Recursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <p className="text-muted-foreground italic">No hay documentos disponibles para este curso.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {documentos.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{doc.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{doc.tipo}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link a trabajos */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Trabajos de la Comunidad</h3>
            <p className="text-sm text-muted-foreground">
              Ve las creaciones de otros estudiantes
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to={`/cursos/${id}/trabajos`}>
              Ver trabajos
            </Link>
          </Button>
        </div>
      </Card>

      {/* Preguntas y respuestas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Preguntas del Curso
          </CardTitle>
          {usuario?.rol !== 'admin' && (
            <CardDescription>
              Solo los administradores pueden responder las preguntas.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lista de preguntas */}
          <div className="space-y-4">
            {preguntas.length === 0 ? (
              <p className="text-muted-foreground italic">Todavía no hay preguntas.</p>
            ) : (
              preguntas.map((pregunta) => {
                const puedeEditarPregunta = usuario && pregunta.usuario_id === usuario.id && !pregunta.respuesta;  
                const puedeEliminarPregunta = usuario && (pregunta.usuario_id === usuario.id || usuario.rol === 'admin');
                const puedeEditarRespuesta = usuario && usuario.rol === 'admin' && pregunta.respuesta;

                return (
                  <Card key={pregunta.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <strong>{pregunta.usuario}</strong>
                            <Calendar className="h-4 w-4" />
                            {new Date(pregunta.fecha).toLocaleDateString()}
                          </div>
                          
                          {(puedeEditarPregunta || puedeEliminarPregunta) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {puedeEditarPregunta && (
                                  <DropdownMenuItem onClick={() => {
                                    iniciarEdicionPregunta(pregunta);
                                  }}>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Editar pregunta
                                  </DropdownMenuItem>
                                )}
                                {puedeEliminarPregunta && (
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      handleEliminarPregunta(pregunta.id);
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar pregunta
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        
                        {editandoPregunta === pregunta.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={preguntaEditada}
                              onChange={(e) => setPreguntaEditada(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => handleEditarPregunta(pregunta.id)}>
                                <Check className="h-4 w-4 mr-2" />
                                Guardar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setEditandoPregunta(null);
                                  setPreguntaEditada("");
                                }}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="font-medium">{pregunta.pregunta}</p>
                        )}

                        {pregunta.respuesta ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded flex-1">
                                {editandoRespuesta === pregunta.id ? (
                                  <div className="space-y-3">
                                    <Textarea
                                      value={respuestaEditada}
                                      onChange={(e) => setRespuestaEditada(e.target.value)}
                                      className="min-h-[80px] bg-white"
                                    />
                                    <div className="flex space-x-2">
                                      <Button size="sm" onClick={() => handleEditarRespuesta(pregunta.id)}>
                                        <Check className="h-4 w-4 mr-2" />
                                        Guardar
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => {
                                          setEditandoRespuesta(null);
                                          setRespuestaEditada("");
                                        }}
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm">
                                    <strong>Respuesta:</strong> {pregunta.respuesta}
                                  </p>
                                )}
                              </div>
                              
                              {puedeEditarRespuesta && editandoRespuesta !== pregunta.id && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => iniciarEdicionRespuesta(pregunta)}
                                  className="ml-2"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm italic text-muted-foreground">
                            Aún sin respuesta.
                          </p>
                        )}

                        {usuario?.rol === 'admin' && !pregunta.respuesta && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = e.target;
                              const respuesta = form.respuesta.value.trim();
                              if (!respuesta) return;

                              responderPregunta(pregunta.id, respuesta);
                              form.reset();
                            }}
                            className="space-y-3"
                          >
                            <Textarea
                              name="respuesta"
                              placeholder="Escribí tu respuesta..."
                              className="min-h-[80px]"
                            />
                            <Button type="submit" size="sm">
                              Responder
                            </Button>
                          </form>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );

                })
            )}
          </div>

          {/* Formulario nueva pregunta */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Hacer una pregunta</h4>
            <div className="space-y-4">
              <Textarea
                value={nuevaPregunta}
                onChange={(e) => setNuevaPregunta(e.target.value)}
                placeholder="Escribí tu pregunta sobre el curso..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={enviarPregunta} 
                disabled={!nuevaPregunta.trim()}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Enviar pregunta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CursoDetalle;