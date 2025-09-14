import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Heart, 
  Plus, 
  User, 
  ArrowLeft, 
  Image as ImageIcon,
  Calendar,
  Loader2,
  Upload,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

const Trabajos = () => {
  const { cursoId } = useParams(); 
  const navigate = useNavigate();
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesandoLike, setProcesandoLike] = useState(null);

  useEffect(() => {
    const obtenerTrabajos = async () => {
      const token = localStorage.getItem("token");

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/trabajos/${cursoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTrabajos(data);
      } catch (error) {
        console.error("⚠ Error al obtener trabajos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerTrabajos();
  }, [cursoId]);

  const manejarLike = async (trabajoId) => {
    const token = localStorage.getItem("token");
    setProcesandoLike(trabajoId);

    try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/trabajos/${trabajoId}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Actualizar estado local después de dar/quitar like
        setTrabajos((prev) =>
          prev.map((t) =>
            t.id === trabajoId
              ? {
                  ...t,
                  dado_like: !t.dado_like,
                  cantidad_likes: t.dado_like
                    ? t.cantidad_likes - 1
                    : t.cantidad_likes + 1,
                }
              : t
          )
        );
    } catch (error) {
      console.error("⚠ Error al dar/quitar like:", error);
    } finally {
      setProcesandoLike(null);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          onClick={() => navigate(`/cursos/${cursoId}`)}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al curso
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-pink-600 flex items-center">
            <ImageIcon className="h-8 w-8 mr-3" />
            Trabajos publicados
          </h2>
          <p className="text-muted-foreground mt-1">
            Explora y comparte trabajos de la comunidad
          </p>
        </div>
        
        <Button
          asChild
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Link to={`/cursos/${cursoId}/trabajos/nuevo`}>
            <Plus className="h-4 w-4 mr-2" />
            Subir nuevo trabajo
          </Link>
        </Button>
      </div>

      {/* Gallery Grid */}
      {trabajos.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay trabajos aún
            </h3>
            <p className="text-muted-foreground mb-6">
              ¡Sé el primero en compartir tu trabajo con la comunidad!
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
            >
              <Link to={`/cursos/${cursoId}/trabajos/nuevo`}>
                <Upload className="h-4 w-4 mr-2" />
                Subir primer trabajo
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-1 text-pink-600" />
                <span className="font-medium">{trabajos.length}</span>
                <span className="text-muted-foreground ml-1">
                  {trabajos.length === 1 ? 'trabajo' : 'trabajos'}
                </span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-red-500" />
                <span className="font-medium">
                  {trabajos.reduce((total, trabajo) => total + trabajo.cantidad_likes, 0)}
                </span>
                <span className="text-muted-foreground ml-1">likes totales</span>
              </div>
            </div>
          </div>

          {/* Works Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trabajos.map((trabajo) => (
              <Card 
                key={trabajo.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={trabajo.imagen_url}
                    alt={`Trabajo de ${trabajo.autor}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  {/* Author and Date */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {trabajo.autor?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {trabajo.autor}
                      </span>
                    </div>
                    {trabajo.fecha && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatearFecha(trabajo.fecha)}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {trabajo.descripcion}
                  </p>

                  {/* Like Button */}
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => manejarLike(trabajo.id)}
                      variant="ghost"
                      size="sm"
                      disabled={procesandoLike === trabajo.id}
                      className={`p-2 h-auto ${
                        trabajo.dado_like 
                          ? "text-red-500 hover:text-red-600" 
                          : "text-gray-400 hover:text-red-500"
                      } transition-colors`}
                    >
                      {procesandoLike === trabajo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart 
                          className={`h-4 w-4 ${trabajo.dado_like ? 'fill-current' : ''}`} 
                        />
                      )}
                    </Button>
                    
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-gray-100 text-gray-600"
                    >
                      {trabajo.cantidad_likes} {trabajo.cantidad_likes === 1 ? 'like' : 'likes'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Trabajos;