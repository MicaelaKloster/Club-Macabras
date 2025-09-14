import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  FileText,
  Link2,
  FileImage,
  FileType,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";

const NuevoDocumento = () => {
    const { cursoId } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [url, setUrl] = useState('');
    const [tipo, setTipo] = useState('pdf');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        setEnviando(true);

        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/documentos`,
                {
                    curso_id: parseInt(cursoId),
                    titulo,
                    url,
                    tipo,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            setMensaje(data.mensaje);
            setTitulo('');
            setUrl('');
            setTipo('pdf');

            setTimeout(() => {
                navigate(`/admin/materiales/${cursoId}`);
            }, 2000);

        } catch (err) {
            console.error('❌ Error al subir documento: ', err);
            setError('Error al subir el documento. Inténtalo de nuevo.');
        } finally {
            setEnviando(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'PDF':
                return <FileText className="h-4 w-4" />;
            case 'Word':
                return <FileType className="h-4 w-4" />;
            case 'Imagen':
                return <FileImage className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'PDF':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'Word':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Imagen':
                return 'text-green-600 bg-green-50 border-green-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-pink-600 flex items-center justify-center">
                    <Upload className="h-8 w-8 mr-3" />
                    Subir Nuevo Documento
                </h2>
                <p className="text-muted-foreground">
                    Agrega un documento al curso para que los estudiantes puedan acceder
                </p>
            </div>

            {/* Alert Messages */}
            {error && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {mensaje && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                        {mensaje}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                {/* Form */}
                <div className="md:col-span-2">
                    <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                            <CardTitle className="text-xl flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-pink-600" />
                                Información del Documento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="titulo" className="text-sm font-medium">
                                        Título del documento
                                    </Label>
                                    <Input
                                        id="titulo"
                                        type="text"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        placeholder="Ej: Material de apoyo - Capítulo 1"
                                        required
                                        disabled={enviando}
                                        className="focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="url" className="text-sm font-medium flex items-center">
                                        <Link2 className="h-4 w-4 mr-2" />
                                        URL del documento
                                    </Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://drive.google.com/..."
                                        required
                                        disabled={enviando}
                                        className="focus:ring-2 focus:ring-pink-500"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Pega el enlace directo del documento (Google Drive, Dropbox, etc.)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipo" className="text-sm font-medium">
                                        Tipo de documento
                                    </Label>
                                    <select
                                        id="tipo"
                                        value={tipo}
                                        onChange={(e) => setTipo(e.target.value)}
                                        disabled={enviando}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    >
                                        <option value="PDF">PDF</option>
                                        <option value="Word">Word</option>
                                        <option value="Imagen">Imagen</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={enviando}
                                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3"
                                    >
                                        {enviando ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Guardar Documento
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                    <Card className="shadow-md">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                            <CardTitle className="text-lg flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-blue-700" />
                                Vista previa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <div className="flex items-start space-x-3">
                                        <div className={`p-2 rounded-md border ${getTypeColor(tipo)}`}>
                                            {getTypeIcon(tipo)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {titulo || 'Título del documento'}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Tipo: {tipo}
                                            </p>
                                            {url && (
                                                <p className="text-xs text-blue-600 mt-2 truncate">
                                                    {url}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips Card */}
                    <Card className="border-amber-200 bg-amber-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center text-amber-700">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Consejos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <ul className="text-xs text-amber-700 space-y-2">
                                <li>• Asegúrate de que el enlace sea público</li>
                                <li>• Usa títulos descriptivos</li>
                                <li>• Verifica que el enlace funcione</li>
                                <li>• Los archivos PDF son ideales para lectura</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NuevoDocumento;