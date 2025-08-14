import { Link } from "react-router-dom";

const PagoPendiente = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-center p-6">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">
        ⏳ Pago pendiente de confirmación
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Estamos esperando la confirmación de tu pago. Esto puede tardar unos minutos.
      </p>
      <Link
        to="/"
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg shadow"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default PagoPendiente;