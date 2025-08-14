import { Link } from "react-router-dom";

const PagoFallido = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-4">
        ❌ Ocurrió un problema con tu pago
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        El pago no pudo completarse. Por favor, intenta nuevamente o elige otro método de pago.
      </p>
      <Link
        to="/membresia"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow"
      >
        Reintentar pago
      </Link>
    </div>
  );
};

export default PagoFallido;