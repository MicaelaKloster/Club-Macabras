import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Clock, RefreshCw, CreditCard, Home, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

const PagoPendiente = () => {
  const navigate = useNavigate();

  // Función para refrescar el estado
  const refrescarEstado = () => {
    window.location.reload();
  };

  // Función para iniciar un nuevo pago
  const irAPagar = () => {
    navigate("/membresia");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Pending Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-6 text-center">
            <div className="relative">
              <Clock className="h-20 w-20 text-white mx-auto mb-4" />
              <div className="absolute -top-2 -right-2">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Pago pendiente de confirmación
            </h1>
            <Badge className="bg-white/20 text-white border-white/30">
              <Clock className="h-3 w-3 mr-1" />
              En proceso
            </Badge>
          </div>

          <CardContent className="p-8 text-center space-y-6">
            {/* Status Message */}
            <div className="space-y-3">
              <div className="text-4xl animate-pulse">⏳</div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Estamos esperando la confirmación de tu pago. 
                Este proceso puede tardar unos minutos dependiendo de tu banco.
              </p>
            </div>

            {/* Process Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center justify-center">
                <Info className="h-4 w-4 mr-2" />
                ¿Qué está pasando?
              </h3>
              <div className="text-sm text-blue-700 space-y-2 text-left">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <span>Tu pago fue enviado correctamente</span>
                </div>
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 text-yellow-600 animate-spin" />
                  <span>Esperando confirmación del banco</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Una vez confirmado, tu acceso será automático</span>
                </div>
              </div>
            </div>

            {/* Important Warning */}
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <strong>Importante:</strong> Si tu pago ya fue acreditado de tu cuenta, 
                no realices otro pago para evitar duplicados.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={refrescarEstado}
                className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white py-3 text-base shadow-lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Refrescar estado
              </Button>

              <Button
                onClick={irAPagar}
                variant="outline"
                className="w-full border-2 border-green-300 text-green-700 hover:bg-green-50 py-3 text-base"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Realizar otro pago
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-3 text-base"
              >
                <Link to="/">
                  <Home className="h-5 w-5 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 text-center">
                Tiempo estimado de confirmación
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-green-700 font-medium">Tarjeta</p>
                  <p className="text-gray-600">1-5 min</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-1 flex items-center justify-center animate-pulse">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-yellow-700 font-medium">Transferencia</p>
                  <p className="text-gray-600">5-15 min</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-orange-700 font-medium">Otros</p>
                  <p className="text-gray-600">Hasta 1 hora</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>¿Tu pago no se confirma después de 1 hora?</strong>
              </p>
              <p className="text-xs text-gray-500">
                Contáctanos y te ayudaremos a revisar el estado de tu transacción
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floating Elements for Visual Appeal */}
        <div className="absolute top-20 left-8 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-12 w-12 h-12 bg-amber-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/3 right-8 w-8 h-8 bg-orange-300 rounded-full opacity-40 animate-pulse"></div>
      </div>
    </div>
  );
};

export default PagoPendiente;