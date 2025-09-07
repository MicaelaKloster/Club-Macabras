import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, MessageCircle, Calendar, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Foro = () => {
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          className="bg-pink-700 hover:bg-pink-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tema
        </Button>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-pink-800 flex items-center justify-center">
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
                className="bg-pink-700 hover:bg-pink-800 text-white"
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
                    className="text-xl font-semibold text-pink-700 hover:text-pink-800 hover:underline line-clamp-2 flex-1"
                  >
                    {tema.tema}
                  </Link>
                  
                  <Badge variant="secondary" className="ml-4 flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {tema.cantidad_respuestas || 0}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {tema.nombre || "Desconocido"}
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