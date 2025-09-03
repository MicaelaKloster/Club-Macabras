import { Link } from "react-router-dom";

const PaginaNoEncontrada = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-pink-600 mb-4">404</h1>
          <div className="text-6xl mb-6">🔍</div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Lo sentimos, la página que estás buscando no existe o fue movida a otra ubicación.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="block bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Volver al inicio
          </Link>
          
          <Link
            to="/dashboard"
            className="block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Ir a cursos
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>¿Necesitas ayuda?</p>
          <p>
            Contactanos en:{" "}
            <a href="mailto:info@clubmacabras.com" className="text-pink-600 hover:underline">
              info@clubmacabras.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaginaNoEncontrada;