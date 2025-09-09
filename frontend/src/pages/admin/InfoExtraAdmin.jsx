import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Info, 
  Settings, 
  Save, 
  Edit,
  ExternalLink,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileText,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const InfoExtraAdmin = () => {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [infoExistente, setInfoExistente] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [cargandoInfo, setCargandoInfo] = useState(false);

    // Estados para configuraciones
    const [precioMembresia, setPrecioMembresia] = useState('');
    const [mensajeConfig, setMensajeConfig] = useState('');
    const [cargandoConfig, setCargandoConfig] = useState(false);

    useEffect(() => {
        cargarInfoExistente();
        cargarConfiguraciones();
    }, []);

    const cargarInfoExistente = async () => {
        const token = localStorage.getItem('token');
        
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/info-extra`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setInfoExistente(res.data);
            setTitulo(res.data.titulo);
            setDescripcion(res.data.descripcion || '');
            setUrl(res.data.url);
            setModoEdicion(true);

        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error al cargar info extra:', error);
            }
            // Si no existe info, quedamos en modo creación
            setModoEdicion(false);
        }
    };

    const cargarConfiguraciones = async () => {
        const token = localStorage.getItem('token');
        
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/info-extra/configuraciones`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setPrecioMembresia(res.data.precio_membresia.toString());

        } catch (error) {
            console.error('Error al cargar configuraciones:', error);
        }
    };

    const handleSubmitInfo = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        setCargandoInfo(true);

        const token = localStorage.getItem('token');
        const datos = { titulo, descripcion, url };

        try {
            if (modoEdicion && infoExistente) {
                // Actualizar existente
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/info-extra/${infoExistente.id}`,
                    datos,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setMensaje('Información actualizada exitosamente');
            } else {
                // Crear nueva
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/info-extra`,
                    datos,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setMensaje('Información creada exitosamente');
                setModoEdicion(true);
            }

            setTimeout(() => setMensaje(''), 3000);

        } catch (err) {
            console.error('Error al guardar info extra:', err);
            setError(err.response?.data?.error || 'Error al guardar la información');
            setTimeout(() => setError(''), 3000);
        } finally {
            setCargandoInfo(false);
        }
    };

    const handleSubmitConfig = async (e) => {
        e.preventDefault();
        setMensajeConfig('');
        setCargandoConfig(true);

        const token = localStorage.getItem('token');

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/info-extra/configuraciones`,
                { precio_membresia: parseInt(precioMembresia) },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMensajeConfig('Precio actualizado exitosamente');
            setTimeout(() => setMensajeConfig(''), 3000);

        } catch (err) {
            console.error('Error al actualizar precio:', err);
            setMensajeConfig('Error al actualizar el precio');
            setTimeout(() => setMensajeConfig(''), 3000);
        } finally {
            setCargandoConfig(false);
        }
    };

    const caracteresDescripcion = 500 - descripcion.length;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
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
                <h1 className="text-3xl font-bold text-pink-600 flex items-center justify-center">
                    <Settings className="h-8 w-8 mr-3" />
                    Administración de Info Extra y Configuraciones
                </h1>
                <p className="text-muted-foreground">
                    Gestiona la información adicional y configuraciones del sistema
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                {/* Sección Info Extra */}
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                        <CardTitle className="text-xl text-pink-600 flex items-center">
                            <Info className="h-5 w-5 mr-2" />
                            {modoEdicion ? 'Editar Info Extra' : 'Crear Info Extra'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        {/* Success/Error Messages */}
                        {mensaje && (
                            <Alert className="mb-4 border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-700">
                                    {mensaje}
                                </AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmitInfo} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="titulo" className="text-base font-semibold flex items-center">
                                    <FileText className="h-4 w-4 mr-1" />
                                    Título
                                </Label>
                                <Input
                                    id="titulo"
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    placeholder="Título de la información extra"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion" className="text-base font-semibold">
                                    Descripción (opcional)
                                </Label>
                                <Textarea
                                    id="descripcion"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Descripción del contenido..."
                                    className="min-h-[100px] resize-none"
                                    maxLength={500}
                                />
                                <div className="flex justify-between text-sm">
                                    <p className="text-muted-foreground">
                                        Describe brevemente el contenido
                                    </p>
                                    <span className={`${caracteresDescripcion < 50 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                        {caracteresDescripcion} caracteres restantes
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url" className="text-base font-semibold flex items-center">
                                    <LinkIcon className="h-4 w-4 mr-1" />
                                    URL del documento
                                </Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    URL de Google Drive, Dropbox u otro servicio de almacenamiento
                                </p>
                            </div>

                            {/* Preview */}
                            {url && (
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border-2 border-dashed border-gray-200">
                                    <div className="flex items-center text-sm">
                                        <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                                        <a 
                                            href={url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline truncate"
                                        >
                                            {url}
                                        </a>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={cargandoInfo || !titulo.trim() || !url.trim()}
                                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                            >
                                {cargandoInfo ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {modoEdicion ? 'Actualizando...' : 'Creando...'}
                                    </>
                                ) : (
                                    <>
                                        {modoEdicion ? <Edit className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        {modoEdicion ? 'Actualizar' : 'Crear'} Info Extra
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Sección Configuraciones */}
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                        <CardTitle className="text-xl text-blue-700 flex items-center">
                            <DollarSign className="h-5 w-5 mr-2" />
                            Configuración de Precios
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        {/* Success/Error Messages */}
                        {mensajeConfig && (
                            <Alert className={`mb-4 ${mensajeConfig.includes('Error') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                                {mensajeConfig.includes('Error') ? (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                                <AlertDescription className={mensajeConfig.includes('Error') ? 'text-red-700' : 'text-green-700'}>
                                    {mensajeConfig}
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmitConfig} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="precio" className="text-base font-semibold flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Precio de Membresía (ARS)
                                </Label>
                                <Input
                                    id="precio"
                                    type="number"
                                    value={precioMembresia}
                                    onChange={(e) => setPrecioMembresia(e.target.value)}
                                    placeholder="0"
                                    min="1"
                                    required
                                />
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        <strong>Importante:</strong> Este precio se aplicará a todas las nuevas compras de membresía.
                                        Los usuarios existentes mantendrán el precio que pagaron originalmente.
                                    </p>
                                </div>
                            </div>

                            {/* Current Price Display */}
                            {precioMembresia && (
                                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                    <div className="text-center">
                                        <p className="text-sm text-green-700 mb-1">Precio actual de membresía:</p>
                                        <p className="text-2xl font-bold text-green-800">
                                            $ {parseInt(precioMembresia).toLocaleString('es-AR')} ARS
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={cargandoConfig || !precioMembresia.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {cargandoConfig ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Actualizando precio...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Actualizar Precio
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Tips Card */}
            <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Consejos de administración:</h4>
                    <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-700">
                        <ul className="space-y-1">
                            <li>• La Info Extra es visible para todos los usuarios con membresía</li>
                            <li>• Asegúrate de que la URL sea accesible públicamente</li>
                            <li>• El título debe ser descriptivo y claro</li>
                        </ul>
                        <ul className="space-y-1">
                            <li>• Los cambios de precio solo afectan nuevas compras</li>
                            <li>• Considera notificar cambios importantes a los usuarios</li>
                            <li>• Revisa regularmente el contenido de Info Extra</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InfoExtraAdmin;