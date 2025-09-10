import { Link } from "react-router-dom";
import { Home, BookOpen, Search, Mail, ArrowLeft, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaginaNoEncontrada = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Error Code and Icon */}
            <div className="mb-8">
              <div className="relative">
                <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text mb-4">
                  404
                </h1>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Search className="h-16 w-16 text-pink-300 animate-pulse" />
                </div>
              </div>
              <div className="text-5xl mb-6 animate-bounce">🔍</div>
            </div>
            
            {/* Title and Description */}
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Página no encontrada
              </h2>
              
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Lo sentimos, la página que estás buscando no existe o fue movida a otra ubicación.
                Pero no te preocupes, podemos ayudarte a encontrar lo que necesitas.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white py-3 text-base"
              >
                <Link to="/">
                  <Home className="h-5 w-5 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="w-full border-2 border-gray-300 hover:bg-gray-50 py-3 text-base"
              >
                <Link to="/dashboard">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Ir a cursos
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-3 text-base"
                onClick={() => window.history.back()}
              >
                <button type="button">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver atrás
                </button>
              </Button>
            </div>

            {/* Suggestions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                ¿Qué puedes hacer?
              </h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Verifica que la URL esté escrita correctamente</li>
                <li>• Regresa a la página anterior usando tu navegador</li>
                <li>• Busca el contenido desde la página principal</li>
                <li>• Contacta soporte si el problema persiste</li>
              </ul>
            </div>
            
            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-2 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                ¿Necesitas ayuda?
              </p>
              <p className="text-sm">
                <Button
                  asChild
                  variant="link"
                  className="text-pink-600 hover:text-pink-700 p-0 h-auto font-normal"
                >
                  <a href="mailto:clubmacabras@gmail.com">
                    <Mail className="h-4 w-4 mr-1" />
                    clubmacabras@gmail.com
                  </a>
                </Button>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Te responderemos lo antes posible
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floating Elements for Visual Appeal */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-blue-200 rounded-full opacity-25 animate-pulse"></div>
      </div>
    </div>
  );
};

export default PaginaNoEncontrada;