import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FolderOpen,
  Calendar,
  Tag,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import ImageUploader from '@/components/ImageUploader';


const CursosAdmin = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoCurso, setEditandoCurso] = useState(null);
  const [guardandoCambios, setGuardandoCambios] = useState(false);
  const [eliminandoCurso, setEliminandoCurso] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    imagen_portada: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/cursos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCursos(data.cursos || []);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (curso) => {
    setEditandoCurso(curso.id);
    setFormData({
      titulo: curso.titulo,
      descripcion: curso.descripcion || '',
      categoria: curso.categoria || '',
      imagen_portada: curso.imagen_portada || ''
    });
  };

  const cancelarEdicion = () => {
    setEditandoCurso(null);
    setFormData({ titulo: '', descripcion: '', categoria: '' });
  };

  const guardarCambios = async (cursoId) => {
    if (!formData.titulo.trim()) return;
    
    const token = localStorage.getItem("token");
    setGuardandoCambios(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cursos/${cursoId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar la lista local
      setCursos(cursos.map(curso => 
        curso.id === cursoId 
          ? { ...curso, ...formData }
          : curso
      ));

      setEditandoCurso(null);
      setFormData({ titulo: '', descripcion: '', categoria: '' });
    } catch (error) {
      console.error("Error al actualizar curso:", error);
      alert("Error al guardar los cambios");
    } finally {
      setGuardandoCambios(false);
    }
  };

  const eliminarCurso = async (cursoId, titulo) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el curso "${titulo}"?`)) {
      return;
    }

    const token = localStorage.getItem("token");
    setEliminandoCurso(cursoId);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/cursos/${cursoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remover de la lista local
      setCursos(cursos.filter(curso => curso.id !== cursoId));
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      alert("Error al eliminar el curso");
    } finally {
      setEliminandoCurso(null);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-pink-600 flex items-center">
            <BookOpen className="h-8 w-8 mr-3" />
            Gestión de Cursos
          </h2>
          <p className="text-muted-foreground mt-1">
            Administra todos los cursos de la plataforma
          </p>
        </div>
        
        <Button
          asChild
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Link to="/admin/cursos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Crear nuevo curso
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total de Cursos</p>
              <p className="text-2xl font-bold text-blue-800">{cursos.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      {cursos.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay cursos aún
            </h3>
            <p className="text-muted-foreground mb-6">
              Crea el primer curso para comenzar
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
            >
              <Link to="/admin/cursos/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Crear primer curso
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {cursos.map((curso) => (
            <Card key={curso.id} className="shadow-lg hover:shadow-xl transition-shadow">
              {editandoCurso === curso.id ? (
                // Modo edición
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="titulo" className="text-base font-semibold">Título</Label>
                      <Input
                        id="titulo"
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                        placeholder="Título del curso"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="descripcion" className="text-base font-semibold">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        placeholder="Descripción del curso"
                        className="mt-1 min-h-[100px] resize-none"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="categoria" className="text-base font-semibold">Categoría</Label>
                      <Input
                        id="categoria"
                        type="text"
                        value={formData.categoria}
                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                        placeholder="Categoría del curso"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="imagen_portada" className="text-base font-semibold">Imagen de portada</Label>
                      <ImageUploader
                        currentImageUrl={formData.imagen_portada}
                        onImageChange={(url) => setFormData({...formData, imagen_portada: url})}
                        label="Imagen de portada"
                      />
                  </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => guardarCambios(curso.id)}
                        disabled={guardandoCambios || !formData.titulo.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {guardandoCambios ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={cancelarEdicion}
                        variant="outline"
                        disabled={guardandoCambios}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              ) : (
                // Modo visualización
                <CardContent className="p-6">
                    {curso.imagen_portada && (
                      <div className="w-full h-48 mb-4 overflow-hidden rounded-lg border">
                        <img 
                          src={curso.imagen_portada}
                          alt={curso.titulo}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        {/* Fallback si no carga la imagen */}
                        <div 
                          className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hidden"
                        >
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                    )}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-pink-600 mb-2">{curso.titulo}</h3>
                        <p className="text-gray-700 leading-relaxed mb-3">{curso.descripcion}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            <span>{curso.categoria || "Sin categoría"}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Creado el {formatearFecha(curso.creado_en)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-4">
                        ID: {curso.id}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => navigate(`/admin/materiales/${curso.id}`)}
                        variant="outline"
                        className="hover:bg-purple-50 hover:border-purple-300"
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Gestionar materiales
                      </Button>
                      
                      <Button
                        onClick={() => iniciarEdicion(curso)}
                        variant="outline"
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      
                      <Button
                        onClick={() => eliminarCurso(curso.id, curso.titulo)}
                        variant="outline"
                        disabled={eliminandoCurso === curso.id}
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                      >
                        {eliminandoCurso === curso.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CursosAdmin;