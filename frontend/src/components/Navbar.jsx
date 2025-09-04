import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuAbierto(false); // Cerrar menú después de hacer click
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold text-pink-700">Club Macabras</span>
        </div>

        {/* Enlaces de navegación - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('sobre-nosotros')}
            className="text-gray-700 hover:text-pink-700 transition-colors"
          >
            Sobre Nosotros
          </button>
          
          <button
            onClick={() => scrollToSection('contacto')}
            className="text-gray-700 hover:text-pink-700 transition-colors"
          >
            Contactanos
          </button>
          
          <Link
            to="/registro"
            className="text-gray-700 hover:text-pink-700 transition-colors"
          >
            Registrarme
          </Link>
          
          <Link
            to="/login"
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>

        {/* Botón menú hamburguesa - Móvil */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => scrollToSection('sobre-nosotros')}
              className="block w-full text-left py-2 text-gray-700 hover:text-pink-700 transition-colors"
            >
              Sobre Nosotros
            </button>
            
            <button
              onClick={() => scrollToSection('contacto')}
              className="block w-full text-left py-2 text-gray-700 hover:text-pink-700 transition-colors"
            >
              Contactanos
            </button>
            
            <Link
              to="/registro"
              onClick={() => setMenuAbierto(false)}
              className="block py-2 text-gray-700 hover:text-pink-700 transition-colors"
            >
              Registrarme
            </Link>
            
            <Link
              to="/login"
              onClick={() => setMenuAbierto(false)}
              className="block bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-center mt-2"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;