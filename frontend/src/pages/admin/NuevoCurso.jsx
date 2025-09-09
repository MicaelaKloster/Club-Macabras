import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  BookPlus, 
  Save, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Tag,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NuevoCurso = () => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");
        setCargando(true);

        const token = localStorage.getItem("token");

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/cursos`,
                { titulo, descripcion, categoria },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMensaje(data.mensaje || "Curso creado exitosamente");
            setTitulo("");
            setDescripcion("");
            setCategoria("");

            setTimeout(() => {
                navigate("/admin/cursos");
            }, 2000);

        } catch (err) {
            console.error("⚠ Error al crear curso: ", err);
            setError(err.response?.data?.error || "No se pudo crear el curso");
        } finally {
            setCargando(false);
        }
    };

    const caracteresDescripcion = 500 - descripcion.length;
    const caracteresCategoria = 50 - categoria.length;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a cursos
                </Button>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-pink-600 flex items-center justify-center">
                    <BookPlus className="h-8 w-8 mr-3" />
                    Crear nuevo curso
                </h2>
                <p className="text-muted-foreground">
                    Completa la información básica para crear un nuevo curso
                </p>
            </div>

            {/* Main Form Card */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                    <CardTitle className="text-xl text-gray-700 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Información del curso
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                    {/* Success/Error Messages */}
                    {mensaje && (
                        <Alert className="mb-6 border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700">
                                {mensaje}
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <Label htmlFor="titulo" className="text-base font-semibold">
                                Título del curso
                            </Label>
                            <Input
                                id="titulo"
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Ej: Introducción a la Pintura al Óleo"
                                className="text-base"
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Elige un título claro y descriptivo que explique qué aprenderán los estudiantes
                            </p>
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <Label htmlFor="descripcion" className="text-base font-semibold">
                                Descripción
                            </Label>
                            <Textarea
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Describe qué contenido incluirá el curso, qué aprenderán los estudiantes, y qué requisitos previos necesitan..."
                                className="min-h-[120px] resize-none"
                                maxLength={500}
                                required
                            />
                            <div className="flex justify-between text-sm">
                                <p className="text-muted-foreground">
                                    Proporciona una descripción detallada del contenido y objetivos
                                </p>
                                <span className={`${caracteresDescripcion < 50 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                    {caracteresDescripcion} caracteres restantes
                                </span>
                            </div>
                        </div>

                        {/* Category Field */}
                        <div className="space-y-2">
                            <Label htmlFor="categoria" className="text-base font-semibold flex items-center">
                                <Tag className="h-4 w-4 mr-1" />
                                Categoría
                            </Label>
                            <Input
                                id="categoria"
                                type="text"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                placeholder="Ej: Arte, Manualidades, Técnicas Básicas"
                                className="text-base"
                                maxLength={50}
                                required
                            />
                            <div className="flex justify-between text-sm">
                                <p className="text-muted-foreground">
                                    Ayuda a los estudiantes a encontrar tu curso
                                </p>
                                <span className={`${caracteresCategoria < 10 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                    {caracteresCategoria} caracteres restantes
                                </span>
                            </div>
                        </div>

                        {/* Preview Section */}
                        {(titulo || descripcion || categoria) && (
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                                    <BookPlus className="h-4 w-4 mr-2" />
                                    Vista previa del curso:
                                </h4>
                                <div className="space-y-2">
                                    {titulo && (
                                        <h3 className="text-lg font-semibold text-pink-600">
                                            {titulo}
                                        </h3>
                                    )}
                                    {categoria && (
                                        <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                            {categoria}
                                        </span>
                                    )}
                                    {descripcion && (
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {descripcion}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={cargando || !titulo.trim() || !descripcion.trim() || !categoria.trim()}
                                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 text-base shadow-lg"
                            >
                                {cargando ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Creando curso...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Crear curso
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para crear un buen curso:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Usa un título específico y atractivo</li>
                        <li>• En la descripción, explica qué aprenderán los estudiantes</li>
                        <li>• Menciona el nivel de dificultad (principiante, intermedio, avanzado)</li>
                        <li>• La categoría ayuda a que encuentren tu curso más fácilmente</li>
                        <li>• Después de crear el curso podrás agregar videos y documentos</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default NuevoCurso;