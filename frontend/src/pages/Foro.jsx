import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { 
  ArrowLeft, 
  Plus, 
  MessageCircle, 
  Calendar, 
  User, 
  Loader2, 
  MoreVertical,
  Edit3,
  Trash2,
  Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

const Foro = () => {
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesandoAccion, setProcesandoAccion] = useState(null);
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const fetchTemas = async () => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/temas-foro`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTemas(data.temas);
    } catch (error) {
      console.error("⚠ Error al obtener temas del foro:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarTema = async (temaId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este tema? Esta acción eliminará el tema y todas sus respuestas. No se puede deshacer.")) {
      return;
    }

    const token = localStorage.getItem("token");
    setProcesandoAccion(temaId);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/temas-foro/${temaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remover del estado local
      setTemas((prev) => prev.filter((t) => t.id !== temaId));
    } catch (error) {
      console.error("⚠ Error al eliminar tema:", error);
      alert("Error al eliminar el tema");
    } finally {
      setProcesandoAccion(null);
    }
  };

  const puedeModificar = (tema) => {
    return usuario?.id === tema.usuario_id || usuario?.rol === 'admin';
  };

  useEffect(() => {
    fetchTemas();
  }, []);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncarTexto = (texto, limite = 150) => {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + "...";
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver atrás
        </Button>

        <Button
          onClick={() => navigate("/foro/nuevo")}
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tema
        </Button>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-pink-600 flex items-center justify-center">
          <MessageCircle className="h-8 w-8 mr-3" />
          Foro de la comunidad
        </h2>
        <p className="text-muted-foreground">
          Conecta, comparte y aprende con otros miembros de la comunidad
        </p>
      </div>

      {/* Topics Grid */}
      <div className="space-y-4">
        {temas.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay temas aún
              </h3>
              <p className="text-muted-foreground mb-4">
                ¡Sé el primero en iniciar una conversación!
              </p>
              <Button
                onClick={() => navigate("/foro/nuevo")}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear primer tema
              </Button>
            </CardContent>
          </Card>
        ) : (
          temas.map((tema) => (
            <Card 
              key={tema.id} 
              className="hover:shadow-md transition-all duration-200 border-l-4 border-l-pink-500"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Link
                    to={`/foro/${tema.id}`}
                    className="text-xl font-semibold text-pink-600 hover:text-pink-700 hover:underline line-clamp-2 flex-1"
                  >
                    {tema.tema}
                  </Link>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="secondary" className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {tema.cantidad_respuestas || 0}
                    </Badge>

                    {/* Menu de opciones para autor/admin */}
                    {puedeModificar(tema) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={procesandoAccion === tema.id}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/foro/${tema.id}/editar`)}
                            disabled={procesandoAccion === tema.id}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Editar tema
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => eliminarTema(tema.id)}
                            disabled={procesandoAccion === tema.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar tema
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {tema.nombre || "Desconocido"}
                    {usuario?.id === tema.usuario_id && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Tuyo
                      </Badge>
                    )}
                    {usuario?.rol === 'admin' && usuario?.id !== tema.usuario_id && (
                      <Crown className="h-3 w-3 ml-1 text-yellow-600" title="Puedes moderar este tema" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatearFecha(tema.fecha)}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  {truncarTexto(tema.contenido)}
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/foro/${tema.id}`}
                    className="text-pink-600 hover:text-pink-700 font-medium text-sm hover:underline"
                  >
                    Ver conversación completa →
                  </Link>
                  
                  {(tema.cantidad_respuestas || 0) > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {tema.cantidad_respuestas === 1 ? '1 respuesta' : `${tema.cantidad_respuestas} respuestas`}
                    </span>
                  )}
                </div>

                {procesandoAccion === tema.id && (
                  <div className="flex items-center justify-center mt-4 p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">Procesando...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats Footer */}
      {temas.length > 0 && (
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              📊 {temas.length} {temas.length === 1 ? 'tema activo' : 'temas activos'} • 
              {' '}{temas.reduce((total, tema) => total + (tema.cantidad_respuestas || 0), 0)} respuestas totales
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Foro;