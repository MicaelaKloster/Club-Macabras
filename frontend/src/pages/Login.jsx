import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Mail, Lock, LogIn, AlertCircle, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, contraseña }
      );

      login(data.usuario);
      localStorage.setItem("token", data.token);
      console.log("Login exitoso", data.usuario);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMostrarContraseña = () => {
    setMostrarContraseña(!mostrarContraseña);
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
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Iniciar sesión
            </CardTitle>
            <CardDescription>
              Ingresa a tu cuenta de Club Macabras
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
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
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  <Link 
                    to="/recuperar-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={mostrarContraseña ? "text" : "password"}
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleMostrarContraseña}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {mostrarContraseña ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
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
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Ingresar
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link 
                  to="/registro" 
                  className="text-primary hover:underline font-medium"
                >
                  Regístrate aquí
                </Link>
              </p>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">
                    ¿Primera vez aquí?
                  </span>
                </div>
              </div>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  Conocer Club Macabras
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;