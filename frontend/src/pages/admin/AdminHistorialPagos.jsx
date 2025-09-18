import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Calendar,
  User,
  CreditCard,
  BarChart3,
  Download,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

const AdminHistorialPagos = () => {
    const navigate = useNavigate();
    const [pagos, setPagos] = useState([]);
    const [estadisticas, setEstadisticas] = useState({});
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(1);
    const limite = 20;

    const obtenerHistorialCompleto = async (paginaActual = 1) => {
        const token = localStorage.getItem("token");
        
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/historial-pagos/admin/todos?pagina=${paginaActual}&limite=${limite}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setPagos(data.pagos || []);
            setEstadisticas(data.estadisticas || {});
            setPagina(paginaActual);
        } catch (error) {
            console.error("⚠ Error al obtener historial:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerHistorialCompleto();
    }, []);

    const formatearMonto = (monto) => {
        return Number(monto).toLocaleString('es-AR', { 
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        });
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const EstadisticasCard = () => (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Ingresos Totales</p>
                            <p className="text-2xl font-bold text-green-800">
                                {formatearMonto(estadisticas.ingresos_totales || 0)}
                            </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Total Pagos</p>
                            <p className="text-2xl font-bold text-blue-800">
                                {estadisticas.total_pagos || 0}
                            </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600">Mes Actual</p>
                            <p className="text-2xl font-bold text-purple-800">
                                {formatearMonto(estadisticas.ingresos_mes_actual || 0)}
                            </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600">Pagos Hoy</p>
                            <p className="text-2xl font-bold text-orange-800">
                                {estadisticas.pagos_hoy || 0}
                            </p>
                        </div>
                        <Calendar className="h-8 w-8 text-orange-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card>
                    <CardContent className="p-6">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center space-x-4 p-4 border-b">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    <h1 className="text-3xl font-bold text-pink-600">
                        Historial de Pagos
                    </h1>
                </div>
                
                <div className="flex space-x-2">
                    <Button
                        onClick={() => obtenerHistorialCompleto(pagina)}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualizar
                    </Button>
                </div>
            </div>

            {/* Estadísticas */}
            <EstadisticasCard />

            {/* Tabla de pagos */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Historial de Transacciones ({pagos.length})
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-pink-50 to-purple-50">
                                <tr className="text-left border-b">
                                    <th className="px-6 py-4 font-semibold text-pink-600">Fecha</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">Usuario</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">Descripción</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">Monto</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">Método</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">Estado</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">ID Pago</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagos.map((pago) => (
                                    <tr key={pago.id} className="hover:bg-gray-50 border-b transition-colors">
                                        <td className="px-6 py-4 text-sm">
                                            {formatearFecha(pago.fecha_pago)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                    {pago.nombre_usuario?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{pago.nombre_usuario}</p>
                                                    <p className="text-xs text-gray-500">{pago.email_usuario}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {pago.descripcion || 'Membresía Club Macabras'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-green-600">
                                                {formatearMonto(pago.monto)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {pago.metodo_pago}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge 
                                                className={
                                                    pago.estado === 'approved' 
                                                        ? 'bg-green-100 text-green-700'
                                                        : pago.estado === 'rejected'
                                                        ? 'bg-red-100 text-red-700' 
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }
                                            >
                                                {pago.estado === 'approved' ? (
                                                    <>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Aprobado
                                                    </>
                                                ) : pago.estado === 'rejected' ? (
                                                    <>
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Rechazado
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {pago.estado}
                                                    </>
                                                )}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-600">
                                            {pago.payment_id ? (
                                                <span title={pago.payment_id}>
                                                    ...{pago.payment_id.slice(-8)}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagos.length === 0 && (
                        <div className="text-center py-8">
                            <CreditCard className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                No hay pagos registrados
                            </h3>
                            <p className="text-gray-500">
                                Los pagos aparecerán aquí una vez que se procesen
                            </p>
                        </div>
                    )}

                    {pagos.length >= limite && (
                        <div className="p-6 border-t bg-gray-50">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    Mostrando página {pagina} ({pagos.length} registros)
                                </p>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => obtenerHistorialCompleto(pagina - 1)}
                                        disabled={pagina <= 1}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        onClick={() => obtenerHistorialCompleto(pagina + 1)}
                                        disabled={pagos.length < limite}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminHistorialPagos;