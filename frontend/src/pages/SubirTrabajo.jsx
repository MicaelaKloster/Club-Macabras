import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Upload, 
  Image, 
  FileText, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  X,
  Loader2,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const SubirTrabajo = () => {
    const { cursoId } = useParams();
    const navigate = useNavigate();
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");
    const [subiendo, setSubiendo] = useState(false);

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        setImagen(file);
        setError(""); // Limpiar errores previos
        
        if (file) {
            // Validar tamaño (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                setError("La imagen no puede superar los 5MB");
                setImagen(null);
                setPreview(null);
                return;
            }
            
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                setError("Por favor selecciona un archivo de imagen válido");
                setImagen(null);
                setPreview(null);
                return;
            }
            
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubiendo(true);

        const token = localStorage.getItem("token");

        try {
            const formData = new FormData();
            formData.append("imagen", imagen);
            formData.append("descripcion", descripcion);
            formData.append("curso_id", cursoId);

            await axios.post(`${import.meta.env.VITE_API_URL}/trabajos`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate(`/cursos/${cursoId}/trabajos`);
        
        } catch (err) {
            console.error("⚠ Error al subir trabajo:", err);
            setError(err.response?.data?.error || "Error al subir el trabajo. Inténtalo de nuevo.");
        } finally {
            setSubiendo(false);
        }
    };

    const limpiarImagen = () => {
        setImagen(null);
        setPreview(null);
        setError("");
    };

    const caracteresRestantes = 500 - descripcion.length;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
                <Button
                    onClick={() => navigate(`/cursos/${cursoId}/trabajos`)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a trabajos
                </Button>
            </div>

            {/* Main Card */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                    <CardTitle className="text-2xl font-bold text-pink-800 flex items-center">
                        <Upload className="h-6 w-6 mr-3" />
                        Subir nuevo trabajo
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Comparte tu trabajo con la comunidad y recibe feedback
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
                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <Label htmlFor="imagen" className="text-base font-semibold flex items-center">
                                <Image className="h-5 w-5 mr-2 text-purple-600" />
                                Imagen del trabajo
                            </Label>
                            
                            {!preview ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <div className="space-y-2">
                                        <p className="text-lg font-medium text-gray-700">
                                            Sube tu imagen
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            JPG, PNG, GIF hasta 5MB
                                        </p>
                                    </div>
                                    <Input
                                        id="imagen"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImagenChange}
                                        required
                                        className="mt-4 cursor-pointer"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={preview}
                                                alt="Previsualización"
                                                className="w-32 h-32 object-cover rounded-lg shadow-md"
                                            />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                        <Check className="h-3 w-3 mr-1" />
                                                        Imagen cargada
                                                    </Badge>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={limpiarImagen}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Cambiar
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    <strong>Nombre:</strong> {imagen?.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <strong>Tamaño:</strong> {(imagen?.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description Section */}
                        <div className="space-y-2">
                            <Label htmlFor="descripcion" className="text-base font-semibold flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                Descripción del trabajo
                            </Label>
                            <Textarea
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Describe tu trabajo: técnicas utilizadas, proceso creativo, materiales, inspiración..."
                                className="min-h-[120px] resize-none"
                                maxLength={500}
                                required
                            />
                            <div className="flex justify-between text-sm">
                                <p className="text-muted-foreground">
                                    Comparte detalles sobre tu proceso creativo
                                </p>
                                <span className={`${caracteresRestantes < 50 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                    {caracteresRestantes} caracteres restantes
                                </span>
                            </div>
                        </div>

                        {/* Preview Section */}
                        {(preview && descripcion) && (
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Vista previa del trabajo:
                                </h4>
                                <div className="flex space-x-4">
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 line-clamp-3">
                                            {descripcion}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={subiendo || !imagen || !descripcion.trim()}
                                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 text-base shadow-lg"
                            >
                                {subiendo ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Subiendo trabajo...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-5 w-5 mr-2" />
                                        Publicar trabajo
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
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para un buen trabajo:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Usa buena iluminación para la foto</li>
                        <li>• Describe tu proceso creativo y técnicas</li>
                        <li>• Menciona los materiales que utilizaste</li>
                        <li>• Comparte lo que aprendiste haciendo este trabajo</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubirTrabajo;