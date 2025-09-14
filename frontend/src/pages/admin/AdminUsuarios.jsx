import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  User, 
  Mail, 
  MapPin, 
  Shield, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Settings,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

const AdminUsuarios = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroRol, setFiltroRol] = useState("todos");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [cargandoCambio, setCargandoCambio] = useState(null);
    const [usuarioEditandoEstado, setUsuarioEditandoEstado] = useState(null);
    const [cargandoEstado, setCargandoEstado] = useState(null);

    const obtenerUsuarios = async () => {
        const token = localStorage.getItem("token");

        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/usuarios`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsuarios(data || []);
        } catch (error) {
            console.error("⚠️ Error al obtener usuarios: ", error);
        } finally {
            setLoading(false);
        }
    };

    const cambiarRolUsuario = async (usuarioId, nuevoRol) => {
        const token = localStorage.getItem("token");
        setCargandoCambio(usuarioId);

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/usuarios/${usuarioId}/rol`,
                { rol: nuevoRol },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Actualizar el estado local
            setUsuarios(usuarios.map(usuario => 
                usuario.id === usuarioId 
                    ? { ...usuario, rol: nuevoRol }
                    : usuario
            ));

            setUsuarioEditando(null);
            
            // Mostrar mensaje de éxito (opcional)
            console.log(`✅ Rol cambiado exitosamente para usuario ${usuarioId}`);
            
        } catch (error) {
            console.error("❌ Error al cambiar rol:", error);
            // Aquí podrías mostrar un toast o mensaje de error
            alert("Error al cambiar el rol del usuario");
        } finally {
            setCargandoCambio(null);
        }
    };

    const cambiarEstadoUsuario = async (usuarioId, nuevoEstado) => {
        const token = localStorage.getItem("token");
        setCargandoEstado(usuarioId);

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/usuarios/${usuarioId}/estado`,
                { estado: nuevoEstado },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Actualizar el estado local
            setUsuarios(usuarios.map(usuario => 
                usuario.id === usuarioId 
                    ? { ...usuario, estado: nuevoEstado }
                    : usuario
            ));

            setUsuarioEditandoEstado(null);
            
            // Mostrar mensaje de éxito (opcional)
            console.log(`✅ Estado cambiado exitosamente para usuario ${usuarioId} a ${nuevoEstado === 1 ? 'Activo' : 'Inactivo'}`);
            
        } catch (error) {
            console.error("❌ Error al cambiar estado:", error);
            // Aquí podrías mostrar un toast o mensaje de error
            alert("Error al cambiar el estado del usuario");
        } finally {
            setCargandoEstado(null);
        }
    };

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    // Filtros aplicados
    const usuariosFiltrados = usuarios.filter(usuario => {
        const coincideNombre = usuario.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
                              usuario.email.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideRol = filtroRol === "todos" || usuario.rol === filtroRol;
        const coincideEstado = filtroEstado === "todos" || 
                              (filtroEstado === "activo" && usuario.estado === 1) ||
                              (filtroEstado === "inactivo" && usuario.estado !== 1);
        
        return coincideNombre && coincideRol && coincideEstado;
    });

    // Estadísticas
    const totalUsuarios = usuarios.length;
    const usuariosActivos = usuarios.filter(u => u.estado === 1).length;
    const admins = usuarios.filter(u => u.rol === 'admin').length;

    // Componente para el selector de rol
    const SelectorRol = ({ usuario }) => {
        if (usuarioEditando === usuario.id) {
            return (
                <div className="flex items-center space-x-2">
                    <select
                        value={usuario.rol}
                        onChange={(e) => cambiarRolUsuario(usuario.id, e.target.value)}
                        disabled={cargandoCambio === usuario.id}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    >
                        <option value="usuario">Usuario</option>
                        <option value="admin">Admin</option>
                    </select>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setUsuarioEditando(null)}
                        className="h-6 w-6 p-0"
                        disabled={cargandoCambio === usuario.id}
                    >
                        <XCircle className="h-3 w-3" />
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center space-x-2">
                <Badge 
                    variant={usuario.rol === 'admin' ? 'default' : 'secondary'}
                    className={
                        usuario.rol === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                    }
                >
                    {usuario.rol === 'admin' ? (
                        <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                        </>
                    ) : (
                        <>
                            <User className="h-3 w-3 mr-1" />
                            Usuario
                        </>
                    )}
                </Badge>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setUsuarioEditando(usuario.id)}
                    className="h-6 w-6 p-0 hover:bg-gray-200"
                    disabled={cargandoCambio === usuario.id}
                >
                    <Settings className="h-3 w-3" />
                </Button>
            </div>
        );
    };

    // Componente para el selector de estado
    const SelectorEstado = ({ usuario }) => {
        if (usuarioEditandoEstado === usuario.id) {
            return (
                <div className="flex items-center space-x-2">
                    <select
                        value={usuario.estado}
                        onChange={(e) => cambiarEstadoUsuario(usuario.id, parseInt(e.target.value))}
                        disabled={cargandoEstado === usuario.id}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    >
                        <option value={1}>Activo</option>
                        <option value={0}>Inactivo</option>
                    </select>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setUsuarioEditandoEstado(null)}
                        className="h-6 w-6 p-0"
                        disabled={cargandoEstado === usuario.id}
                    >
                        <XCircle className="h-3 w-3" />
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center space-x-2">
                <Badge 
                    variant={usuario.estado === 1 ? 'default' : 'secondary'}
                    className={
                        usuario.estado === 1 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                    }
                >
                    {usuario.estado === 1 ? (
                        <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                        </>
                    ) : (
                        <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactivo
                        </>
                    )}
                </Badge>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setUsuarioEditandoEstado(usuario.id)}
                    className="h-6 w-6 p-0 hover:bg-gray-200"
                    disabled={cargandoEstado === usuario.id}
                >
                    <Settings className="h-3 w-3" />
                </Button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-8 w-64" />
                
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-8 w-12" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                    <Users className="h-8 w-8 mr-3" />
                    Gestión de Usuarios
                </h2>
                <p className="text-muted-foreground">
                    Administra y visualiza todos los usuarios de la plataforma
                </p>
            </div>

            {/* Alert Info */}
            <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2 text-amber-700">
                        <AlertTriangle className="h-4 w-4" />
                        <p className="text-sm">
                            <strong>Nota:</strong> Haz clic en el ícono de configuración <Settings className="h-3 w-3 inline" /> junto al rol o estado para modificarlo.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Usuarios</p>
                                <p className="text-2xl font-bold text-blue-800">{totalUsuarios}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Activos</p>
                                <p className="text-2xl font-bold text-green-800">{usuariosActivos}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Administradores</p>
                                <p className="text-2xl font-bold text-purple-800">{admins}</p>
                            </div>
                            <Shield className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Buscar</label>
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Nombre o email..."
                                    value={filtroNombre}
                                    onChange={(e) => setFiltroNombre(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rol</label>
                            <select
                                value={filtroRol}
                                onChange={(e) => setFiltroRol(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="todos">Todos los roles</option>
                                <option value="admin">Administrador</option>
                                <option value="usuario">Usuario</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado</label>
                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="activo">Activos</option>
                                <option value="inactivo">Inactivos</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                onClick={() => {
                                    setFiltroNombre("");
                                    setFiltroRol("todos");
                                    setFiltroEstado("todos");
                                }}
                                variant="outline"
                                size="sm"
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Usuarios ({usuariosFiltrados.length})
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-pink-50 to-purple-50">
                                <tr className="text-left border-b">
                                    <th className="px-6 py-4 font-semibold text-pink-600">Usuario</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">Contacto</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">Ubicación</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">Rol</th>
                                    <th className="px-6 py-4 font-semibold text-pink-600">Estado Membresia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 border-b transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {u.nombre?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{u.nombre}</p>
                                                    <p className="text-sm text-gray-500">ID: {u.id}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="h-4 w-4 mr-2" />
                                                {u.email}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <div>
                                                    <p>{u.provincia || "-"}</p>
                                                    <p className="text-xs text-gray-400">{u.ciudad || "-"}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <SelectorRol usuario={u} />
                                        </td>

                                        <td className="px-6 py-4">
                                            <SelectorEstado usuario={u} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {usuariosFiltrados.length === 0 && (
                        <div className="text-center py-8">
                            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                No se encontraron usuarios
                            </h3>
                            <p className="text-muted-foreground">
                                Intenta ajustar los filtros de búsqueda
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUsuarios;