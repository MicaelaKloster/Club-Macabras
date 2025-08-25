import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-center p-6">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">
        ⏳ Pago pendiente de confirmación
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Estamos esperando la confirmación de tu pago. Esto puede tardar unos minutos.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={refrescarEstado}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg shadow"
        >
          🔄 Refrescar estado
        </button>

        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm p-3 rounded">
          ⚠️ Si tu pago ya fue acreditado, no realices otro para evitar duplicados.
        </div>

        <button
          onClick={irAPagar}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow"
        >
          💳 Pagar de nuevo
        </button>
      </div>

      <Link
        to="/"
        className="mt-6 text-gray-600 hover:underline text-sm"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
};

export default PagoPendiente;