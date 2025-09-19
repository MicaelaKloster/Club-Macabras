import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertTriangle,
  Edit3,
  MessageCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";

const EditarTema = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  
  const [tema, setTema] = useState({
    tema: "",
    contenido: ""
  });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [temaOriginal, setTemaOriginal] = useState(null);

  useEffect(() => {
    const obtenerTema = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/temas-foro/${id}/detalle`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Verificar permisos
        if (data.usuario_id !== usuario?.id && usuario?.rol !== 'admin') {
          navigate('/foro');
          return;
        }
        
        setTema({
          tema: data.tema,
          contenido: data.contenido
        });
        setTemaOriginal(data);
        
      } catch (error) {
        console.error("Error al obtener tema:", error);
        setError("No se pudo cargar el tema para editar");
        setTimeout(() => navigate('/foro'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (usuario) {
      obtenerTema();
    }
  }, [id, navigate, usuario]);

  const handleChange = (field, value) => {
    setTema(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!tema.tema.trim() || !tema.contenido.trim()) {
      setError("El título y contenido son obligatorios");
      return;
    }

    if (tema.tema.length < 5 || tema.tema.length > 200) {
      setError("El título debe tener entre 5 y 200 caracteres");
      return;
    }

    if (tema.contenido.length < 10 || tema.contenido.length > 2000) {
      setError("El contenido debe tener entre 10 y 2000 caracteres");
      return;
    }

    const token = localStorage.getItem("token");
    setGuardando(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/temas-foro/${id}`,
        tema,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/foro/${id}`);
      
    } catch (error) {
      console.error("Error al actualizar tema:", error);
      setError(error.response?.data?.error || "Error al actualizar el tema");
    } finally {
      setGuardando(false);
    }
  };

  const caracteresRestantesTitulo = 200 - tema.tema.length;
  const caracteresRestantesContenido = 2000 - tema.contenido.length;
  const hayCambios = temaOriginal && (
    tema.tema !== temaOriginal.tema || 
    tema.contenido !== temaOriginal.contenido
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center">
          <Skeleton className="h-8 w-20" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          onClick={() => navigate(`/foro/${id}`)}
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al tema
        </Button>
      </div>

      {/* Main Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <CardTitle className="text-2xl font-bold text-pink-600 flex items-center">
            <Edit3 className="h-6 w-6 mr-3" />
            Editar tema del foro
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Modifica tu tema y mantén la conversación actualizada
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="tema" className="text-base font-semibold flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                Título del tema
              </Label>
              <Input
                id="tema"
                type="text"
                value={tema.tema}
                onChange={(e) => handleChange('tema', e.target.value)}
                placeholder="¿Sobre qué quieres hablar?"
                className="text-base"
                maxLength={200}
                required
              />
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">
                  Un título claro ayuda a otros a entender tu tema
                </p>
                <span className={`${caracteresRestantesTitulo < 20 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {caracteresRestantesTitulo} caracteres restantes
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-2">
              <Label htmlFor="contenido" className="text-base font-semibold flex items-center">
                <Edit3 className="h-5 w-5 mr-2 text-blue-600" />
                Contenido del tema
              </Label>
              <Textarea
                id="contenido"
                value={tema.contenido}
                onChange={(e) => handleChange('contenido', e.target.value)}
                placeholder="Desarrolla tu idea, comparte tu experiencia, haz preguntas..."
                className="min-h-[150px] resize-none"
                maxLength={2000}
                required
              />
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">
                  Explica tu tema con detalle para generar buenas conversaciones
                </p>
                <span className={`${caracteresRestantesContenido < 100 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {caracteresRestantesContenido} caracteres restantes
                </span>
              </div>
            </div>

            {/* Indicador de cambios */}
            {hayCambios && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Has realizado cambios en este tema. No olvides guardar.
                </AlertDescription>
              </Alert>
            )}

            {/* Botones de acción */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={guardando || !hayCambios}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg"
              >
                {guardando ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando cambios...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar cambios
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/foro/${id}`)}
                disabled={guardando}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Tips para un buen tema:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Usa un título descriptivo y claro</li>
            <li>• Proporciona contexto y detalles en el contenido</li>
            <li>• Haz preguntas específicas para fomentar la participación</li>
            <li>• Mantén un tono respetuoso y constructivo</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarTema;