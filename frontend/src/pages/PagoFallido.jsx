import { Link, useNavigate } from "react-router-dom";
import { XCircle, CreditCard, Home, RefreshCw, AlertTriangle, HelpCircle, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";

const PagoFallido = () => {
  const navigate = useNavigate();

  // Función para iniciar un nuevo pago
  const irAPagar = () => {
    navigate("/membresia");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Error Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
            <div className="relative">
              <XCircle className="h-20 w-20 text-white mx-auto mb-4" />
              <div className="absolute -top-2 -right-2">
                <AlertTriangle className="h-8 w-8 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Problema con el pago
            </h1>
            <p className="text-red-100 text-sm">
              No te preocupes, esto puede solucionarse fácilmente
            </p>
          </div>

          <CardContent className="p-8 text-center space-y-6">
            {/* Error Message */}
            <div className="space-y-3">
              <div className="text-4xl">😔</div>
              <p className="text-lg text-gray-700 leading-relaxed">
                El pago no pudo completarse. Esto puede deberse a varios motivos, 
                pero no te preocupes, tenemos varias opciones para ayudarte.
              </p>
            </div>

            {/* Possible Causes */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Posibles causas:</strong> Fondos insuficientes, datos incorrectos, 
                problema temporal del banco, o conexión interrumpida.
              </AlertDescription>
            </Alert>

            {/* Solutions Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                ¿Qué puedes hacer?
              </h3>
              <ul className="text-sm text-blue-700 space-y-2 text-left">
                <li className="flex items-start">
                  <RefreshCw className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  Verificar los datos de tu tarjeta y intentar nuevamente
                </li>
                <li className="flex items-start">
                  <CreditCard className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  Probar con otra tarjeta o método de pago
                </li>
                <li className="flex items-start">
                  <Phone className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  Contactar a tu banco si el problema persiste
                </li>
                <li className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  Escribirnos si necesitas ayuda adicional
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={irAPagar}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-base shadow-lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Intentar pago nuevamente
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

            {/* Contact Support */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-3 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                <strong>¿Necesitas ayuda?</strong>
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <Button
                    asChild
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                  >
                    <a href="mailto:clubmacabras@gmail.com">
                      <Mail className="h-4 w-4 mr-1" />
                      clubmacabras@gmail.com
                    </a>
                  </Button>
                </p>
                <p className="text-xs text-gray-500">
                  Nuestro equipo te ayudará a resolver el problema rápidamente
                </p>
              </div>
            </div>

            {/* Reassurance Message */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>No te preocupes:</strong> No se realizó ningún cargo a tu tarjeta. 
                Puedes intentar nuevamente cuando quieras sin problema.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floating Elements for Visual Appeal */}
        <div className="absolute top-20 left-8 w-12 h-12 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-12 w-8 h-8 bg-orange-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/3 right-8 w-6 h-6 bg-yellow-300 rounded-full opacity-40 animate-pulse"></div>
      </div>
    </div>
  );
};

export default PagoFallido;