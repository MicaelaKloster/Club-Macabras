import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { 
  Info, 
  ArrowLeft, 
  Settings, 
  FileText, 
  ExternalLink, 
  Calendar, 
  AlertCircle,
  Shield,
  Clock,
  Users,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";

const InfoExtra = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [infoExtra, setInfoExtra] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarInfoExtra = async () => {
            const token = localStorage.getItem('token');
            
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/info-extra`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                setInfoExtra(res.data);

            } catch (error) {
                console.error('Error al cargar info extra:', error);
                if (error.response?.status === 404) {
                    setError('No hay información extra disponible en este momento.');
                } else {
                    setError('Error al cargar la información. Inténtalo más tarde.');
                }
            } finally {
                setLoading(false);
            }
        };

        cargarInfoExtra();
    }, []);

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48" />
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-6">
                <Card className="text-center">
                    <CardContent className="p-8">
                        <AlertCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Información no disponible
                        </h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a cursos
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                    <Info className="h-8 w-8 text-pink-600" />
                    <h1 className="text-3xl font-bold text-pink-600">Info Extra</h1>
                    {usuario?.rol === 'admin' && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            Administrador
                        </Badge>
                    )}
                </div>
                
                <div className="flex gap-3">
                    <Button
                        onClick={() => navigate('/dashboard')}
                        variant="outline"
                        className="flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a cursos
                    </Button>
                    
                    {usuario?.rol === 'admin' && (
                        <Button
                            onClick={() => navigate('/admin/info-extra')}
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Gestionar Info Extra
                        </Button>
                    )}
                </div>
            </div>

            {infoExtra && (
                <div className="space-y-6">
                    {/* Main Content Card */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl text-gray-800 mb-2">
                                        {infoExtra.titulo}
                                    </CardTitle>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Actualizado el: {formatearFecha(infoExtra.actualizado_en)}
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-white">
                                    <FileText className="h-3 w-3 mr-1" />
                                    Contenido exclusivo
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6">
                            {/* Description */}
                            {infoExtra.descripcion && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                        Descripción
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                        {infoExtra.descripcion}
                                    </p>
                                </div>
                            )}

                            <Separator />

                            {/* Access Link */}
                            <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-pink-600 mb-3 flex items-center">
                                    <ExternalLink className="h-5 w-5 mr-2" />
                                    Acceder al contenido
                                </h3>
                                <div className="space-y-3">
                                    <Button
                                        asChild
                                        className="bg-pink-600 hover:bg-pink-700 text-white text-base px-8 py-3"
                                    >
                                        <a
                                            href={infoExtra.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FileText className="h-5 w-5 mr-2" />
                                            Abrir documento
                                            <ExternalLink className="h-4 w-4 ml-2" />
                                        </a>
                                    </Button>
                                    <p className="text-sm text-gray-600 flex items-center">
                                        <Info className="h-4 w-4 mr-1" />
                                        El enlace se abrirá en una nueva ventana
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Information Cards Grid */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <div className="flex items-center mb-2">
                                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                                    <h4 className="font-semibold text-blue-700">Contenido exclusivo</h4>
                                </div>
                                <p className="text-blue-600 text-sm">
                                    Este contenido es solo para miembros registrados
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4">
                                <div className="flex items-center mb-2">
                                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                                    <h4 className="font-semibold text-green-700">Actualizado</h4>
                                </div>
                                <p className="text-green-600 text-sm">
                                    El contenido se actualiza periódicamente
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-purple-50 border-purple-200">
                            <CardContent className="p-4">
                                <div className="flex items-center mb-2">
                                    <Users className="h-5 w-5 text-purple-600 mr-2" />
                                    <h4 className="font-semibold text-purple-700">Soporte</h4>
                                </div>
                                <p className="text-purple-600 text-sm">
                                    ¿Problemas para acceder? Contacta soporte
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Help Alert */}
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>¿Necesitas ayuda?</strong> Si experimentas problemas para acceder al contenido 
                            o tienes preguntas sobre la información, no dudes en contactar al equipo de soporte.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
};

export default InfoExtra;