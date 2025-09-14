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
  Loader2,
  Trash2,
  X,
  Plus,
  Eye,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Alert, AlertDescription } from "@/components/ui/Alert";

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

    // Estados para eliminación
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    // Estados para edición en cards
    const [editandoCard, setEditandoCard] = useState(null);

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

        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error al cargar info extra:', error);
            }
            // Si no existe info, limpiamos el estado
            setInfoExistente(null);
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
            if (modoEdicion && editandoCard) {
                // Actualizar existente
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/info-extra/${editandoCard.id}`,
                    datos,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setMensaje('Información actualizada exitosamente');
                setEditandoCard(null);
                setModoEdicion(false);
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
            }

            // Limpiar formulario y recargar datos
            setTitulo('');
            setDescripcion('');
            setUrl('');
            await cargarInfoExistente();

            setTimeout(() => setMensaje(''), 3000);

        } catch (err) {
            console.error('Error al guardar info extra:', err);
            setError(err.response?.data?.error || 'Error al guardar la información');
            setTimeout(() => setError(''), 3000);
        } finally {
            setCargandoInfo(false);
        }
    };

    const iniciarEdicion = (info) => {
        setTitulo(info.titulo);
        setDescripcion(info.descripcion || '');
        setUrl(info.url);
        setModoEdicion(true);
        setEditandoCard(info);
        // Scroll al formulario
        document.getElementById('formulario-info').scrollIntoView({ behavior: 'smooth' });
    };

    const cancelarEdicion = () => {
        setTitulo('');
        setDescripcion('');
        setUrl('');
        setModoEdicion(false);
        setEditandoCard(null);
        setError('');
        setMensaje('');
    };

    const handleEliminar = async () => {
        if (!infoExistente) return;

        setEliminando(true);
        const token = localStorage.getItem('token');

        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/info-extra/${infoExistente.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMensaje('Información eliminada exitosamente');
            setMostrarConfirmacion(false);
            await cargarInfoExistente(); // Recargar para actualizar la vista
            
            setTimeout(() => setMensaje(''), 3000);

        } catch (err) {
            console.error('Error al eliminar info extra:', err);
            setError(err.response?.data?.error || 'Error al eliminar la información');
            setTimeout(() => setError(''), 3000);
        } finally {
            setEliminando(false);
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

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

            <div className="space-y-6">
                {/* Sección de archivos existentes */}
                {infoExistente && (
                    <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                            <CardTitle className="text-xl text-indigo-700 flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Información Extra Actual
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Card className="border-2 border-indigo-200 bg-indigo-50 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                                {infoExistente.titulo}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                Actualizado: {formatearFecha(infoExistente.actualizado_en)}
                                            </div>
                                            {infoExistente.descripcion && (
                                                <p className="text-gray-700 text-sm bg-white p-2 rounded border">
                                                    {infoExistente.descripcion}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <Button
                                                onClick={() => window.open(infoExistente.url, '_blank')}
                                                size="sm"
                                                variant="outline"
                                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => iniciarEdicion(infoExistente)}
                                                size="sm"
                                                variant="outline"
                                                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => setMostrarConfirmacion(true)}
                                                size="sm"
                                                variant="outline"
                                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <LinkIcon className="h-3 w-3 mr-1" />
                                        <span className="truncate">{infoExistente.url}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                    {/* Sección Info Extra */}
                    <Card className="shadow-lg" id="formulario-info">
                        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl text-pink-600 flex items-center">
                                    <Plus className="h-5 w-5 mr-2" />
                                    {modoEdicion ? 'Editar Info Extra' : 'Crear Info Extra'}
                                </CardTitle>
                                {modoEdicion && (
                                    <Button
                                        onClick={cancelarEdicion}
                                        size="sm"
                                        variant="ghost"
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            {modoEdicion && editandoCard && (
                                <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                                    <p className="text-sm text-blue-700">
                                        Editando: <strong>{editandoCard.titulo}</strong>
                                    </p>
                                </div>
                            )}
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

                                <div className="flex space-x-2">
                                    <Button
                                        type="submit"
                                        disabled={cargandoInfo || !titulo.trim() || !url.trim()}
                                        className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                                    >
                                        {cargandoInfo ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                {modoEdicion ? 'Actualizando...' : 'Creando...'}
                                            </>
                                        ) : (
                                            <>
                                                {modoEdicion ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                                {modoEdicion ? 'Actualizar' : 'Crear'} Info Extra
                                            </>
                                        )}
                                    </Button>
                                    
                                    {modoEdicion && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={cancelarEdicion}
                                            disabled={cargandoInfo}
                                            className="px-4"
                                        >
                                            Cancelar
                                        </Button>
                                    )}
                                </div>
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

            {/* Modal de confirmación para eliminar */}
            {mostrarConfirmacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirmar eliminación
                            </h3>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-gray-700 mb-2">
                                ¿Estás seguro de que deseas eliminar esta información extra?
                            </p>
                            {infoExistente && (
                                <div className="bg-gray-50 p-3 rounded border">
                                    <p className="font-medium text-sm">{infoExistente.titulo}</p>
                                    {infoExistente.descripcion && (
                                        <p className="text-sm text-gray-600 mt-1">{infoExistente.descripcion}</p>
                                    )}
                                </div>
                            )}
                            <p className="text-red-600 text-sm mt-2 font-medium">
                                Esta acción no se puede deshacer y la información dejará de estar disponible para los usuarios inmediatamente.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                onClick={() => setMostrarConfirmacion(false)}
                                variant="outline"
                                className="flex-1"
                                disabled={eliminando}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleEliminar}
                                variant="destructive"
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                disabled={eliminando}
                            >
                                {eliminando ? (
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
                </div>
            )}
        </div>
    );
};

export default InfoExtraAdmin;