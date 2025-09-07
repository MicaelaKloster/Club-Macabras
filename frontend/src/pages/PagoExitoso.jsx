import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, BookOpen, Home, Sparkles, Gift, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PagoExitoso = () => {
  const navigate = useNavigate();

  const irACursos = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-white mx-auto mb-4 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-8 w-8 text-yellow-300 animate-bounce" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              ¡Pago realizado con éxito!
            </h1>
            <Badge className="bg-white/20 text-white border-white/30">
              <Gift className="h-3 w-3 mr-1" />
              Membresía activa
            </Badge>
          </div>

          <CardContent className="p-8 text-center space-y-6">
            {/* Success Message */}
            <div className="space-y-3">
              <div className="text-4xl animate-bounce">🎉</div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Tu membresía ya está activa. Ya podés acceder a todos los cursos disponibles 
                y disfrutar de todo el contenido exclusivo.
              </p>
            </div>

            {/* Benefits Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center justify-center">
                <Sparkles className="h-4 w-4 mr-2" />
                ¿Qué tienes disponible ahora?
              </h3>
              <ul className="text-sm text-green-700 space-y-2 text-left">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Acceso completo a todos los cursos
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Contenido exclusivo y material descargable
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Participación en foros de la comunidad
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Soporte prioritario
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={irACursos}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-base shadow-lg"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Ir a cursos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-2 border-gray-300 hover:bg-gray-50 py-3 text-base"
              >
                <Link to="/">
                  <Home className="h-5 w-5 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
            </div>

            {/* Welcome Message */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>¡Bienvenido a la comunidad!</strong>
              </p>
              <p className="text-xs text-gray-500">
                Disfruta aprendiendo y no dudes en contactarnos si necesitas ayuda
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floating Success Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-green-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 right-8 w-12 h-12 bg-emerald-300 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/3 right-16 w-8 h-8 bg-yellow-300 rounded-full opacity-50 animate-pulse"></div>
        
        {/* Confetti-like elements */}
        <div className="absolute top-16 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-16 w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-100"></div>
        <div className="absolute top-40 left-8 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-200"></div>
      </div>
    </div>
  );
};

export default PagoExitoso;