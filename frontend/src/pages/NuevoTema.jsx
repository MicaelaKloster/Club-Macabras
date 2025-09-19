import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MessageCirclePlus, Send, X, AlertTriangle, FileText, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Alert, AlertDescription } from "@/components/ui/Alert";

const NuevoTema = () => {
  const [tema, setTema] = useState("");
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validaciones del frontend que coinciden con el backend
    if (!tema.trim() || !contenido.trim()) {
      setError("El título y contenido son obligatorios");
      return;
    }

    if (tema.length < 5 || tema.length > 200) {
      setError("El título debe tener entre 5 y 200 caracteres");
      return;
    }

    if (contenido.length < 10 || contenido.length > 2000) {
      setError("El contenido debe tener entre 10 y 2000 caracteres");
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/temas-foro`,
        { tema: tema.trim(), contenido: contenido.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Navegar al tema recién creado si el backend devuelve el ID
      if (data.id) {
        navigate(`/foro/${data.id}`);
      } else {
        navigate("/foro");
      }
    } catch (err) {
      console.error("⚠ Error al crear tema:", err);
      setError(err.response?.data?.error || "No se pudo publicar el tema");
    } finally {
      setIsLoading(false);
    }
  };

  const caracteresRestantesContenido = 2000 - contenido.length;
  const caracteresRestantesTitulo = 200 - tema.length;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
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

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-pink-600 flex items-center justify-center">
          <MessageCirclePlus className="h-8 w-8 mr-3" />
          Crear Nuevo Tema
        </h2>
        <p className="text-muted-foreground">
          Comparte tu pregunta, idea o experiencia con la comunidad
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <CardTitle className="text-xl text-gray-700 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Detalles del tema
          </CardTitle>
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
            {/* Title Section */}
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-base font-semibold">
                Título del tema
              </Label>
              <Input
                id="titulo"
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                required
                maxLength={200}
                placeholder="Escribe un título claro y descriptivo..."
                className="text-lg"
              />
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">
                  Un buen título ayuda a otros a encontrar y entender tu tema (mínimo 5 caracteres)
                </p>
                <span className={`${caracteresRestantesTitulo < 20 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {caracteresRestantesTitulo} caracteres restantes
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-2">
              <Label htmlFor="contenido" className="text-base font-semibold">
                Contenido
              </Label>
              <Textarea
                id="contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                required
                maxLength={2000}
                placeholder="Describe tu tema con detalle. ¿Qué quieres compartir o preguntar? ¿Qué contexto es importante?..."
                className="min-h-[150px] resize-none"
              />
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">
                  Proporciona suficiente contexto para que otros puedan ayudarte o participar (mínimo 10 caracteres)
                </p>
                <span className={`${caracteresRestantesContenido < 100 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {caracteresRestantesContenido} caracteres restantes
                </span>
              </div>
            </div>

            {/* Preview Box */}
            {(tema || contenido) && (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Vista previa:</h4>
                {tema && (
                  <h3 className="text-lg font-semibold text-pink-600 mb-2">
                    {tema}
                  </h3>
                )}
                {contenido && (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {contenido}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/foro")}
                className="flex-1 sm:flex-none"
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isLoading || tema.length < 5 || contenido.length < 10}
                className="bg-pink-700 hover:bg-pink-800 text-white flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Publicando..." : "Publicar Tema"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Consejos para un buen tema:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Usa un título claro que describa exactamente tu tema</li>
            <li>• Proporciona contexto suficiente en el contenido</li>
            <li>• Sé respetuoso y constructivo</li>
            <li>• Revisa que no exista un tema similar antes de publicar</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NuevoTema;