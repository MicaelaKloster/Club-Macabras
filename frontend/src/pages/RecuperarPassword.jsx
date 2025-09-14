import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from "lucide-react";

const RecuperarPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/recuperar-password`,
        { email }
      );
      
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.error || 
        "Error al enviar el correo de recuperación"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al login
          </Button>
          
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">
                ¡Correo enviado!
              </CardTitle>
              <CardDescription>
                Revisa tu bandeja de entrada
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Te hemos enviado un correo electrónico a <strong>{email}</strong> con 
                las instrucciones para restablecer tu contraseña.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">No encuentras el correo?</p>
                <ul className="text-left space-y-1 text-muted-foreground">
                  <li>• Revisa tu carpeta de spam</li>
                  <li>• Verifica que el email sea correcto</li>
                  <li>• Espera unos minutos, puede tardar</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/login">
                    Volver al login
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Enviar a otro correo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/login")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al login
        </Button>
        
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Recuperar contraseña
            </CardTitle>
            <CardDescription>
              Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Enviar correo de recuperación
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Recordaste tu contraseña?{" "}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecuperarPassword;