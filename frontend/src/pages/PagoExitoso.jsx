import { Link, useNavigate } from "react-router-dom";

const PagoExitoso = () => {
  const navigate = useNavigate();

  const irACursos = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        ✅ ¡Pago realizado con éxito!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Tu membresía ya está activa. Ya podés acceder a todos los cursos disponibles.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={irACursos}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow"
        >
          📚 Ir a cursos
        </button>

        <Link
          to="/"
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow text-center"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PagoExitoso;