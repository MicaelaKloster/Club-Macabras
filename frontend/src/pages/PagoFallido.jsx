import { Link, useNavigate } from "react-router-dom";

const PagoFallido = () => {
  const navigate = useNavigate();

  // Función para iniciar un nuevo pago
  const irAPagar = () => {
    navigate("/membresia");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-4">
        ❌ Ocurrió un problema con tu pago
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        El pago no pudo completarse. Por favor, intenta nuevamente o elige otro método de pago.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={irAPagar}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow"
        >
          💳 Intentar pago nuevamente
        </button>

        <Link
          to="/"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow text-center"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PagoFallido;