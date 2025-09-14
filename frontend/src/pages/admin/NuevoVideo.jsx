import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Video, 
  Save, 
  AlertTriangle, 
  CheckCircle,
  Play,
  Link as LinkIcon,
  Lock,
  Unlock,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Switch } from "@/components/ui/Switch";

const NuevoVideo = () => {
    const { cursoId } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [url, setUrl] = useState('');
    const [esGratuito, setEsGratuito] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        setCargando(true);

        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/videos`,
                {
                    curso_id: parseInt(cursoId),
                    titulo,
                    url,
                    es_gratuito: esGratuito ? 1 : 0,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMensaje(data.mensaje || "Video subido exitosamente");
            setTitulo('');
            setUrl('');
            setEsGratuito(false);

            setTimeout(() => {
                navigate(`/admin/materiales/${cursoId}`);
            }, 2000);

        } catch (err) {
            console.error('⚠ Error al subir video: ', err);
            setError(err.response?.data?.error || 'Error al subir el video. Inténtalo de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    // Función para extraer ID de video de YouTube
    const obtenerIdYoutube = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const videoId = obtenerIdYoutube(url);
    const caracteresRestantes = 100 - titulo.length;

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
                    Volver
                </Button>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-pink-600 flex items-center justify-center">
                    <Video className="h-8 w-8 mr-3" />
                    Subir nuevo video
                </h2>
                <p className="text-muted-foreground">
                    Agrega un video de YouTube al curso
                </p>
            </div>

            {/* Main Form Card */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                    <CardTitle className="text-xl text-purple-700 flex items-center">
                        <Play className="h-5 w-5 mr-2" />
                        Detalles del video
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
                                Título del video
                            </Label>
                            <Input
                                id="titulo"
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Ej: Lección 1: Introducción a las técnicas básicas"
                                className="text-base"
                                maxLength={100}
                                required
                            />
                            <div className="flex justify-between text-sm">
                                <p className="text-muted-foreground">
                                    Un título descriptivo ayuda a los estudiantes a entender el contenido
                                </p>
                                <span className={`${caracteresRestantes < 20 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                    {caracteresRestantes} caracteres restantes
                                </span>
                            </div>
                        </div>

                        {/* URL Field */}
                        <div className="space-y-2">
                            <Label htmlFor="url" className="text-base font-semibold flex items-center">
                                <LinkIcon className="h-4 w-4 mr-1" />
                                URL del video (YouTube)
                            </Label>
                            <Input
                                id="url"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="text-base"
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Copia y pega la URL completa del video de YouTube
                            </p>
                        </div>

                        {/* Video Preview */}
                        {videoId && (
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Vista previa</Label>
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
                                        <img
                                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                            alt="Vista previa del video"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">Video detectado correctamente</p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a href={url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                Ver en YouTube
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Access Type Toggle */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Tipo de acceso</Label>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    {esGratuito ? (
                                        <Unlock className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <Lock className="h-5 w-5 text-orange-600" />
                                    )}
                                    <div>
                                        <p className="font-medium">
                                            {esGratuito ? 'Video gratuito' : 'Requiere membresía'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {esGratuito 
                                                ? 'Visible para todos los usuarios' 
                                                : 'Solo visible para usuarios con membresía'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    checked={esGratuito}
                                    onCheckedChange={setEsGratuito}
                                />
                            </div>
                        </div>

                        {/* Preview Summary */}
                        {(titulo || url) && (
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                                    <Video className="h-4 w-4 mr-2" />
                                    Resumen del video:
                                </h4>
                                <div className="space-y-2">
                                    {titulo && (
                                        <p className="font-medium text-purple-700">{titulo}</p>
                                    )}
                                    {url && (
                                        <p className="text-sm text-gray-600 truncate">{url}</p>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        {esGratuito ? (
                                            <span className="inline-flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                <Unlock className="h-3 w-3 mr-1" />
                                                Gratuito
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                                <Lock className="h-3 w-3 mr-1" />
                                                Membresía
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={cargando || !titulo.trim() || !url.trim() || !videoId}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-base shadow-lg"
                            >
                                {cargando ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Subiendo video...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Guardar video
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">💡 Consejos para subir videos:</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Asegúrate de que el video de YouTube sea público o no listado</li>
                        <li>• Usa títulos descriptivos que indiquen el contenido de la lección</li>
                        <li>• Los videos gratuitos pueden servir como muestra del curso</li>
                        <li>• Organiza los videos en un orden lógico de aprendizaje</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default NuevoVideo;