import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { ArrowLeft, User, Mail, MapPin, Edit3, Loader2, CreditCard, X, AlertTriangle, Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Alert, AlertDescription } from "@/components/ui/Alert";

const Perfil = () => {
    const [perfil, setPerfil] = useState({});
    const [membresia, setMembresia] = useState(null);
    const [historialPagos, setHistorialPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cargandoCancelacion, setCargandoCancelacion] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const obtenerPerfil = async () => {
        const token = localStorage.getItem("token");

        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/perfil`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPerfil(data);
        } catch (error) {
            console.error("⚠ Error al obtener perfil:", error);
        }
    };

    const obtenerMembresia = async () => {
        const token = localStorage.getItem("token");

        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/membresias/${perfil.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMembresia(data);
        } catch (error) {
            console.error("⚠ Error al obtener membresía:", error);
            setMembresia(null);
        }
    };

    const obtenerHistorialPagos = async () => {
        const token = localStorage.getItem("token");

        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/historial-pagos/mis-pagos?limite=5`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setHistorialPagos(data.historial || []);
        } catch (error) {
            console.error("⚠ Error al obtener historial de pagos:", error);
            setHistorialPagos([]);
        }
    };

    const cancelarMembresia = async () => {
        if (!window.confirm('⚠️ ¿Estás seguro que deseas cancelar tu membresía?\n\n• Perderás acceso inmediato a todos los cursos premium\n• No se realizarán más cobros\n• Podrás reactivarla cuando desees\n\n¿Confirmas la cancelación?')) {
            return;
        }
        
        const token = localStorage.getItem("token");
        setCargandoCancelacion(true);
        
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/membresias/cancelar`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            
            alert('✅ Membresía cancelada exitosamente.\n\nTe hemos enviado un email de confirmación.');
            
            // Recargar datos
            await Promise.all([
                obtenerPerfil(),
                obtenerMembresia(),
                obtenerHistorialPagos()
            ]);
            
        } catch (error) {
            console.error('Error al cancelar membresía:', error);
            const mensaje = error.response?.data?.error || 'Error inesperado al cancelar membresía';
            alert(`❌ Error: ${mensaje}`);
        } finally {
            setCargandoCancelacion(false);
        }
    };

    // Componente para mostrar historial de pagos
    const HistorialPagos = () => {
        if (historialPagos.length === 0) {
            return (
                <Card className="border-gray-200">
                    <CardHeader className="bg-gray-50">
                        <CardTitle className="text-lg text-gray-600 flex items-center">
                            <DollarSign className="h-5 w-5 mr-2" />
                            Historial de Pagos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-center space-y-4">
                            <p className="text-gray-600">No tienes pagos registrados aún.</p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card className="border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardTitle className="text-lg text-blue-700 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Historial de Pagos
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {historialPagos.map((pago) => {
                            const fechaPago = new Date(pago.fecha_pago);
                            const esAprobado = pago.estado === 'approved';
                            
                            return (
                                <div key={pago.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${
                                            esAprobado ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                            {esAprobado ? (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {pago.descripcion || 'Membresía Club Macabras'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {fechaPago.toLocaleDateString('es-AR', { 
                                                    day: '2-digit', 
                                                    month: 'long', 
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ${Number(pago.monto).toLocaleString('es-AR', { 
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2 
                                            })}
                                        </p>
                                        <Badge className={
                                            esAprobado 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                        }>
                                            {esAprobado ? 'Aprobado' : 'Pendiente'}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {historialPagos.length >= 5 && (
                            <div className="text-center pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Mostrando los últimos 5 pagos
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Componente para mostrar información de membresía
    const MembresiaInfo = () => {
        if (!membresia || !membresia.activa) {
            return (
                <Card className="border-gray-200">
                    <CardHeader className="bg-gray-50">
                        <CardTitle className="text-lg text-gray-600 flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Estado de Membresía
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="text-center space-y-4">
                            <Badge variant="outline" className="bg-gray-100 text-gray-700">
                                Sin Membresía Activa
                            </Badge>
                            <p className="text-gray-600">No tienes una membresía activa actualmente.</p>
                            <Button
                                onClick={() => navigate("/membresia")}
                                className="bg-pink-600 hover:bg-pink-700 text-white"
                            >
                                Adquirir Membresía
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        const fechaVencimiento = new Date(membresia.fecha_vencimiento);
        const hoy = new Date();
        const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
        const estaProximaAVencer = diasRestantes <= 7 && diasRestantes > 0;
        const estaVencida = diasRestantes < 0;

        return (
            <Card className="border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                    <CardTitle className="text-lg text-green-700 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Membresía Activa
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-700">
                            ✅ Membresía Activa
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                            {membresia.metodo_pago}
                        </Badge>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-600">Fecha de inicio:</span>
                            <span>{new Date(membresia.fecha_inicio).toLocaleDateString('es-AR')}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-600">Vence el:</span>
                            <span className={
                                estaVencida ? 'text-red-600 font-semibold' : 
                                estaProximaAVencer ? 'text-yellow-600 font-semibold' : 
                                'text-gray-900'
                            }>
                                {fechaVencimiento.toLocaleDateString('es-AR')}
                            </span>
                        </div>

                        {!estaVencida && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-600">Días restantes:</span>
                                <span className={`font-semibold ${
                                    estaProximaAVencer ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                    {diasRestantes > 0 ? `${diasRestantes} días` : 'Vence hoy'}
                                </span>
                            </div>
                        )}
                    </div>

                    {estaProximaAVencer && (
                        <Alert className="border-yellow-200 bg-yellow-50">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-700">
                                Tu membresía está próxima a vencer. Renuévala para mantener el acceso a todos los cursos.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex space-x-3 pt-4">
                        <Button
                            onClick={() => navigate("/membresia")}
                            variant="outline"
                            className="flex-1"
                        >
                            Renovar Membresía
                        </Button>
                        
                        <Button
                            onClick={cancelarMembresia}
                            disabled={cargandoCancelacion}
                            variant="destructive"
                            className="flex-1"
                        >
                            {cargandoCancelacion ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Cancelando...
                                </>
                            ) : (
                                <>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancelar Membresía
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    useEffect(() => {
        obtenerPerfil();
    }, []);

    useEffect(() => {
        if (perfil.id) {
            const cargarDatosMembresia = async () => {
                await Promise.all([
                    obtenerMembresia(),
                    obtenerHistorialPagos()
                ]);
                setLoading(false);
            };
            cargarDatosMembresia();
        }
    }, [perfil]);

    useEffect(() => {
        if (location.state?.actualizado) {
            obtenerPerfil(); 
        }
    }, [location.state]);

    const profileFields = [
        {
            label: "Nombre",
            value: perfil.nombre,
            icon: User,
            color: "text-blue-600"
        },
        {
            label: "Email", 
            value: perfil.email,
            icon: Mail,
            color: "text-green-600"
        },
        {
            label: "Provincia",
            value: perfil.provincia || "No especificada",
            icon: MapPin,
            color: "text-orange-600"
        },
        {
            label: "Ciudad",
            value: perfil.ciudad || "No especificada", 
            icon: MapPin,
            color: "text-purple-600"
        }
    ];

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-6">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-20" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-10 w-32 mt-6" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver atrás
                </Button>
            </div>

            {/* Membresía Info */}
            <MembresiaInfo />

            {/* Historial de Pagos */}
            <HistorialPagos />

            {/* Profile Card */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-pink-600 flex items-center">
                            <User className="h-7 w-7 mr-3" />
                            Mi perfil
                        </CardTitle>
                        <Badge variant="secondary" className="text-sm">
                            Usuario
                        </Badge>
                    </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                    {/* Profile Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {profileFields.map((field, index) => {
                            const IconComponent = field.icon;
                            return (
                                <div 
                                    key={index}
                                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className={`p-2 rounded-full bg-white ${field.color}`}>
                                        <IconComponent className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-600">{field.label}:</p>
                                        <p className="text-base text-gray-900 truncate">
                                            {field.value}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Edit Profile Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            onClick={() => navigate("/perfil/editar")}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2 text-base"
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Editar Perfil
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Perfil;