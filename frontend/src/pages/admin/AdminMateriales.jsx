import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  FolderOpen, 
  Video, 
  FileText, 
  Plus, 
  ExternalLink,
  Lock,
  Unlock,
  Play,
  Download,
  Calendar,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";

const AdminMateriales = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerMateriales = async () => {
      const token = localStorage.getItem('token');

      try {
        // Obtener videos
        const resVideos = await axios.get(
          `${import.meta.env.VITE_API_URL}/videos/${cursoId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVideos(resVideos.data.videos || resVideos.data || []);

        // Obtener documentos
        const resDocs = await axios.get(
          `${import.meta.env.VITE_API_URL}/documentos/${cursoId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDocumentos(resDocs.data.documentos || resDocs.data || []);

      } catch (error) {
        console.error('⚠ Error al obtener materiales: ', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerMateriales();
  }, [cursoId]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-8 w-64" />
        
        {/* Videos skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <Skeleton className="h-12 w-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <h2 className="text-3xl font-bold text-pink-600 flex items-center justify-center">
          <FolderOpen className="h-8 w-8 mr-3" />
          Gestión de Materiales
        </h2>
        <p className="text-muted-foreground">
          Administra videos y documentos del curso
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Videos</p>
                <p className="text-2xl font-bold text-purple-800">{videos.length}</p>
              </div>
              <Video className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Documentos</p>
                <p className="text-2xl font-bold text-blue-800">{documentos.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Videos Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-purple-800 flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Videos del curso
            </CardTitle>
            <Button
              onClick={() => navigate(`/admin/materiales/${cursoId}/video/nuevo`)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar video
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {videos.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay videos cargados
              </h3>
              <p className="text-muted-foreground mb-4">
                Agrega el primer video para comenzar
              </p>
              <Button
                onClick={() => navigate(`/admin/materiales/${cursoId}/video/nuevo`)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar primer video
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video, index) => (
                <Card key={video.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-semibold text-purple-700 truncate">
                            {video.titulo}
                          </h4>
                          <Badge 
                            variant={video.es_gratuito ? "secondary" : "default"}
                            className={
                              video.es_gratuito 
                                ? "bg-green-100 text-green-700" 
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {video.es_gratuito ? (
                              <>
                                <Unlock className="h-3 w-3 mr-1" />
                                Gratuito
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Membresía
                              </>
                            )}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          {video.fecha_creacion && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatearFecha(video.fecha_creacion)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="hover:bg-purple-50"
                        >
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Ver video
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Documents Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-blue-800 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documentos del curso
            </CardTitle>
            <Button
              onClick={() => navigate(`/admin/materiales/${cursoId}/documento/nuevo`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar documento
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {documentos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay documentos cargados
              </h3>
              <p className="text-muted-foreground mb-4">
                Agrega el primer documento para comenzar
              </p>
              <Button
                onClick={() => navigate(`/admin/materiales/${cursoId}/documento/nuevo`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar primer documento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {documentos.map((doc, index) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-semibold text-blue-700 truncate">
                            {doc.titulo}
                          </h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {doc.tipo}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          {doc.fecha_creacion && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatearFecha(doc.fecha_creacion)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="hover:bg-blue-50"
                        >
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Ver documento
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMateriales;