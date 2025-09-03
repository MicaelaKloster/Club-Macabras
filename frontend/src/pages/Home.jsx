import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Placeholder para las imágenes del cliente
  const slides = [
    {
      id: 1,
      image: '../assets/background-1.jpg',
      alt: 'Marroquinería artesanal 1'
    },
    {
      id: 2,
      image: '../assets/background-2.jpg',
      alt: 'Marroquinería artesanal 2'
    },
    {
      id: 3,
      image: '../assets/background-4.jpg',
      alt: 'Marroquinería artesanal 3'
    }
  ];

  // Cambio automático cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section con Carrusel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carrusel de imágenes */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback para cuando no hay imágenes
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#f8f9fa';
                }}
              />
              {/* Overlay oscuro para mejor legibilidad del texto */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Aprende el Arte de la Marroquinería
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            Descubre técnicas tradicionales y modernas para crear piezas únicas en cuero. 
            Únete a nuestra comunidad de artesanos apasionados.
          </p>
          <Link
            to="/login"
            className="bg-pink-600 hover:bg-pink-700 text-white text-xl px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            Empieza ya
          </Link>
        </div>

        {/* Indicadores del carrusel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-pink-600' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Sección Sobre Nosotros */}
      <section id="sobre-nosotros" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Sobre Nosotros
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Club Macabras es una comunidad dedicada a preservar y compartir el arte 
                tradicional de la marroquinería. Con años de experiencia en el sector, 
                ofrecemos cursos online especializados para todos los niveles.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Nuestros instructores expertos te guiarán paso a paso en el aprendizaje 
                de técnicas ancestrales y modernas para trabajar el cuero, creando piezas 
                únicas y duraderas.
              </p>
              <div className="flex flex-wrap gap-4 text-pink-600 font-semibold">
                <span>✓ Cursos especializados</span>
                <span>✓ Comunidad activa</span>
                <span>✓ Soporte personalizado</span>
              </div>
            </div>
            <div className="bg-pink-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-pink-700 mb-4">Nuestra Misión</h3>
              <p className="text-gray-700 leading-relaxed">
                Formar artesanos competentes que puedan desarrollar su creatividad 
                y emprendimiento a través del noble arte de trabajar el cuero, 
                preservando técnicas tradicionales y adaptándolas al mundo moderno.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Contacto */}
      <section id="contacto" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Contactanos
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-pink-700 mb-4">
                ¿Tienes preguntas?
              </h3>
              <p className="text-gray-600 mb-6">
                Estamos aquí para ayudarte. Contactanos a través de cualquiera 
                de nuestros canales de comunicación.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📧</span>
                  <span className="text-gray-700">info@clubmacabras.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📱</span>
                  <span className="text-gray-700">+54 9 11 1234-5678</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📍</span>
                  <span className="text-gray-700">Santa Fe, Argentina</span>
                </div>
              </div>
            </div>
            <div className="bg-pink-50 p-8 rounded-lg">
              {/* <h3 className="text-xl font-semibold text-pink-700 mb-4">
                Horarios de Atención
              </h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Lunes a Viernes:</strong> 9:00 - 18:00</p>
                <p><strong>Sábados:</strong> 9:00 - 14:00</p>
                <p><strong>Domingos:</strong> Cerrado</p>
              </div> */}
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Respondemos todas las consultas en un máximo de 24 horas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-pink-400 mb-4">Club Macabras</h3>
              <p className="text-gray-300 leading-relaxed">
                Tu academia online de marroquinería. Aprende, crea y forma parte 
                de nuestra comunidad de artesanos.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><Link to="/registro" className="text-gray-300 hover:text-pink-400 transition-colors">Registrarme</Link></li>
                <li><Link to="/login" className="text-gray-300 hover:text-pink-400 transition-colors">Iniciar Sesión</Link></li>
                <li><button onClick={() => scrollToSection('sobre-nosotros')} className="text-gray-300 hover:text-pink-400 transition-colors">Sobre Nosotros</button></li>
                <li><button onClick={() => scrollToSection('contacto')} className="text-gray-300 hover:text-pink-400 transition-colors">Contacto</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors text-2xl">
                  📘
                </a>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors text-2xl">
                  📷
                </a>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors text-2xl">
                  🐦
                </a>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors text-2xl">
                  📺
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Club Macabras. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;