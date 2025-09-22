import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { User, Mail, Lock, MapPin, Building, UserPlus, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const Registro = () => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [provincia, setProvincia] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");
        setIsLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/usuarios`, {
                nombre,
                email,
                contraseña,
                provincia,
                ciudad
            });

            setMensaje("Registro exitoso. Ahora puedes iniciar sesión.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.error("Error al registrar:", err);
            setError(err.response?.data?.error || "Hubo un problema al registrarse");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
            <div className="w-full max-w-md">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/")}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al inicio
                </Button>
                
                <Card className="w-full">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold text-primary">
                            Crear cuenta
                        </CardTitle>
                        <CardDescription>
                            Únete a la comunidad de Club Macabras
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {mensaje && (
                            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-700">
                                    {mensaje}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-800">
                                <strong>Sitio 100% seguro:</strong> Club Macabras es una plataforma educativa legítima 
                                especializada en marroquinería profesional.
                            </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="nombre"
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="pl-10"
                                        placeholder="Tu nombre completo"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        placeholder="tu@ejemplo.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={contraseña}
                                        onChange={(e) => setContraseña(e.target.value)}
                                        className="pl-10"
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="provincia">Provincia</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            id="provincia"
                                            type="text"
                                            value={provincia}
                                            onChange={(e) => setProvincia(e.target.value)}
                                            className="pl-10"
                                            placeholder="Buenos Aires"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ciudad">Ciudad</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            id="ciudad"
                                            type="text"
                                            value={ciudad}
                                            onChange={(e) => setCiudad(e.target.value)}
                                            className="pl-10"
                                            placeholder="CABA"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                                        Creando cuenta...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        Registrarse
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-4">
                            <p className="text-sm text-muted-foreground">
                                ¿Ya tienes una cuenta?{" "}
                                <Link 
                                    to="/login" 
                                    className="text-primary hover:underline font-medium"
                                >
                                    Inicia sesión
                                </Link>
                            </p>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-muted"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        ¿Quieres conocer más?
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" asChild className="w-full">
                                <Link to="/">
                                    Descubre Club Macabras
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Registro;