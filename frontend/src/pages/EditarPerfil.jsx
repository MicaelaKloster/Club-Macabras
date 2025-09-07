import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Save, Trash2, User, MapPin, Lock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const EditarPerfil = () => {
    const [nombre, setNombre] = useState("");
    const [provincia, setProvincia] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [contraseñaActual, setContraseñaActual] = useState("");
    const [contraseñaNueva, setContraseñaNueva] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const obtenerPerfil = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/perfil`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setNombre(data.nombre || "");
                setProvincia(data.provincia || "");
                setCiudad(data.ciudad || "");

            } catch (error) {
                console.error("⚠ Error al obtener perfil: ", error);
            }
        };

        obtenerPerfil();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setIsLoading(true);

        const token = localStorage.getItem("token");

        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/perfil`,
                {
                    nombre,
                    provincia,
                    ciudad,
                    contraseña_actual: contraseñaActual || undefined,
                    contraseña_nueva: contraseñaNueva || undefined,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMensaje(data.mensaje || "Perfil actualizado correctamente.");
            setTimeout(() => navigate("/perfil", { state: { actualizado: true } }), 1500);

        } catch (error) {
            console.error("⚠ Error al actualizar perfil: ", error);
            setMensaje(error.response?.data?.error || "Error al actualizar perfil. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDesactivarCuenta = async () => {
        const confirmacion = window.confirm(
            "¿Estás seguro de que quieres desactivar tu cuenta? Esta acción no se puede deshacer."
        );

        if (!confirmacion) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_URL}/perfil`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Cuenta desactivada correctamente.");
            logout(); // Cierra sesión

        } catch (error) {
            console.error("⚠ Error al desactivar cuenta: ", error);
            setMensaje("Ocurrió un error al intentar desactivar la cuenta");
        }
    };

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
                    Volver
                </Button>
            </div>

            {/* Main Card */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
                    <CardTitle className="text-2xl font-bold text-pink-800 flex items-center">
                        <User className="h-6 w-6 mr-3" />
                        Editar Perfil
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                    {/* Message Alert */}
                    {mensaje && (
                        <Alert className="mb-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                {mensaje}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <User className="h-5 w-5 mr-2 text-blue-600" />
                                Información Personal
                            </h3>
                            
                            <div className="grid gap-4 md:grid-cols-1">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                        placeholder="Tu nombre completo"
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="provincia" className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1 text-orange-600" />
                                            Provincia
                                        </Label>
                                        <Input
                                            id="provincia"
                                            type="text"
                                            value={provincia}
                                            onChange={(e) => setProvincia(e.target.value)}
                                            placeholder="Tu provincia"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ciudad" className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1 text-purple-600" />
                                            Ciudad
                                        </Label>
                                        <Input
                                            id="ciudad"
                                            type="text"
                                            value={ciudad}
                                            onChange={(e) => setCiudad(e.target.value)}
                                            placeholder="Tu ciudad"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Password Change Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Lock className="h-5 w-5 mr-2 text-green-600" />
                                Cambiar contraseña (opcional)
                            </h3>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="contrasenaActual">Contraseña actual</Label>
                                    <Input
                                        id="contrasenaActual"
                                        type="password"
                                        value={contraseñaActual}
                                        onChange={(e) => setContraseñaActual(e.target.value)}
                                        placeholder="Tu contraseña actual"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contrasenaNueva">Nueva contraseña</Label>
                                    <Input
                                        id="contrasenaNueva"
                                        type="password"
                                        value={contraseñaNueva}
                                        onChange={(e) => setContraseñaNueva(e.target.value)}
                                        placeholder="Tu nueva contraseña"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-pink-700 hover:bg-pink-800 text-white flex-1"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? "Guardando..." : "Guardar cambios"}
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDesactivarCuenta}
                                className="flex-1 sm:flex-none"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Desactivar cuenta
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditarPerfil;