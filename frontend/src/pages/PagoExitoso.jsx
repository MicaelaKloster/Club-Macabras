import { Link } from "react-router-dom";

const PagoExitoso = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        ✅ ¡Pago realizado con éxito!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Tu membresía ya está activa. Ya podés acceder a todos los cursos disponibles.
      </p>
      <Link
        to="/"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default PagoExitoso;