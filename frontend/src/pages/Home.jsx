import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, CheckCircle, Mail, Phone, MapPin, Clock, Gift, Video, Scissors } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: '/images/background-1.jpg',
      alt: 'Marroquinería artesanal 1'
    },
    {
      id: 2,
      image: '/images/background-2.jpg',
      alt: 'Marroquinería artesanal 2'
    },
    {
      id: 3,
      image: '/images/background-4.jpg',
      alt: 'Marroquinería artesanal 3'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section con Carrusel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carrusel de imágenes */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover filter brightness-50"
                style={{ minHeight: '100vh' }}
                onError={(e) => {
                  console.error('Error cargando imagen:', e.target.src);
                }}
                onLoad={() => console.log('Imagen cargada:', slide.image)}
              />
            </div>
          ))}
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <Badge variant="secondary" className="mb-4 text-primary bg-white/90">
            Academia Online de Marroquinería
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Aprende Marroquinería desde cero
            {/* <span className="text-primary-foreground">Marroquinería</span> */}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 leading-relaxed text-white/90">
            Crea tus propios productos y convertí tu pasión en tu nuevo negocio. 
            Unite a nuestra comunidad.
          </p>
          
          <Button asChild size="lg" className="text-lg shadow-lg">
            <Link to="/login">
              Empieza ya
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>

        {/* Indicadores del carrusel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-primary scale-110' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ===== SECCIÓN: Bienvenida al Club ===== */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl mx-auto">

          {/* Encabezado bienvenida */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Club Macabras</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bienvenidas al Club Macabras
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Taller &amp; tutoriales de confección de carteras
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link to="/login">
                  Ver Tutoriales
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
            </div>
          </div>

          {/* Objetivo: regalar 1 máquina por mes */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-12 px-8 text-center">
              <p className="text-lg text-muted-foreground mb-2">Nuestro objetivo:</p>
              <h3 className="text-4xl md:text-5xl font-extrabold text-primary uppercase leading-tight mb-4">
                Regalar 1 Máquina por Mes
              </h3>
              <p className="text-muted-foreground text-base md:text-lg">
                Participas siendo parte del club
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== SECCIÓN: ¿Qué vas a crear? ===== */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container max-w-5xl mx-auto">

          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Nuestros Proyectos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Qué vas a crear?
            </h2>
          </div>

          {/* Grid de creaciones */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: 'Bolsos / Carteras',
                image: '/images/bolso.jpg',
                alt: 'Bolsos y carteras artesanales',
              },
              {
                title: 'Mochilas',
                image: '/images/mochila.jpg',
                alt: 'Mochilas artesanales',
              },
              {
                title: 'Materos',
                image: '/images/matero.jpg',
                alt: 'Materos artesanales',
              },
            ].map((item) => (
              <Card key={item.title} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <CardHeader className="py-4">
                  <CardTitle className="text-center text-primary text-lg">
                    {item.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Vas a lograr */}
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-8">Vas a lograr:</h3>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { text: 'Crear tu fuente de ingreso', icon: <CheckCircle size={22} /> },
                { text: 'Tener tus propias molderia', icon: <CheckCircle size={22} /> },
                { text: 'Aprender siendo parte de una comunidad', icon: <CheckCircle size={22} /> },
              ].map((logro) => (
                <div
                  key={logro.text}
                  className="flex flex-col items-center gap-3 bg-primary text-primary-foreground rounded-2xl py-5 px-4 text-center font-semibold text-sm md:text-base shadow"
                >
                  {logro.icon}
                  {logro.text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ===== SECCIÓN: Con la membresía obtienes ===== */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Membresía</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Con la membresía obtienes:
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Video size={28} />,
                title: 'Acceso inmediato a todo el material (video)',
              },
              {
                icon: <Gift size={28} />,
                title: 'Participas por el sorteo de una máquina',
              },
              {
                icon: <Scissors size={28} />,
                title: 'Molderia y paso a paso',
              },
            ].map((beneficio) => (
              <Card key={beneficio.title} className="bg-primary/5 border-primary/20 text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center text-primary mb-2">
                    {beneficio.icon}
                  </div>
                  <CardTitle className="text-primary text-base font-semibold leading-snug">
                    {beneficio.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild size="lg" className="text-lg shadow-lg px-10">
              <Link to="/registro">
                ¡Quiero unirme al club!
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
          </div>

        </div>
      </section>

      {/* Sección Sobre Nosotros */}
      <section id="sobre-nosotros" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Nuestra Historia</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sobre Nosotros
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Preservando el arte tradicional de la marroquinería con técnicas modernas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Club Macabras es una comunidad dedicada a preservar y compartir el arte 
                tradicional de la marroquinería. Con años de experiencia en el sector, 
                ofrecemos cursos online especializados para todos los niveles.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nuestros instructores expertos te guiarán paso a paso en el aprendizaje 
                de técnicas ancestrales y modernas para trabajar el cuero, creando piezas 
                únicas y duraderas.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle size={20} />
                  <span className="font-medium">Cursos especializados</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle size={20} />
                  <span className="font-medium">Comunidad activa</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle size={20} />
                  <span className="font-medium">Soporte personalizado</span>
                </div>
              </div>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary text-2xl">Nuestra Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Formar artesanos competentes que puedan desarrollar su creatividad 
                  y emprendimiento a través del noble arte de trabajar el cuero, 
                  preservando técnicas tradicionales y adaptándolas al mundo moderno.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sección Contacto */}
      <section id="contacto" className="py-20 px-4 bg-muted/50">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Ponte en Contacto</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contactanos
            </h2>
            <p className="text-lg text-muted-foreground">
              Estamos aquí para ayudarte en tu camino hacia la maestría en marroquinería
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Mail size={24} />
                  ¿Tienes preguntas?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Estamos aquí para ayudarte. Contactanos a través de cualquiera 
                  de nuestros canales de comunicación.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary" size={20} />
                    <span>clubmacabras@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary" size={20} />
                    <span>+54 9 342 5168149</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary" size={20} />
                    <span>Santa Fe, Argentina</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock size={24} />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Lunes a Viernes:</span>
                    <span className="text-muted-foreground">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sábados:</span>
                    <span className="text-muted-foreground">9:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Domingos:</span>
                    <span className="text-muted-foreground">Cerrado</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Respondemos todas las consultas en un máximo de 24 horas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Club Macabras</h3>
              <p className="text-muted-foreground leading-relaxed">
                Plataforma educativa especializada en marroquinería profesional. 
                Sitio 100% seguro y confiable.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle size={16} />
                <span>Certificado SSL A+</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Plataforma</h4>
              <nav className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start p-0 h-auto" asChild>
                  <Link to="/registro">Registrarme</Link>
                </Button>
                <Button variant="ghost" className="justify-start p-0 h-auto" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button variant="ghost" className="justify-start p-0 h-auto" asChild>
                  <Link to="/cursos">Ver Cursos</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start p-0 h-auto"
                  onClick={() => scrollToSection('sobre-nosotros')}
                >
                  Sobre Nosotros
                </Button>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Información Legal</h4>
              <nav className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start p-0 h-auto" asChild>
                  <Link to="/acerca-de">Acerca de</Link>
                </Button>
                <Button variant="ghost" className="justify-start p-0 h-auto" asChild>
                  <Link to="/politica-de-privacidad">Política de Privacidad</Link>
                </Button>
                <Button variant="ghost" className="justify-start p-0 h-auto" asChild>
                  <Link to="/terminos-de-servicio">Términos de Servicio</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start p-0 h-auto"
                  onClick={() => scrollToSection('contacto')}
                >
                  Contacto
                </Button>
              </nav>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Síguenos</h4>
              <div className="flex space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary hover:text-primary/80"
                  onClick={() => window.open('https://instagram.com/macabrascarteras', '_blank')}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary hover:text-primary/80"
                  onClick={() => window.open('https://tiktok.com/@macabrascarteras', '_blank')}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary hover:text-primary/80"
                  onClick={() => window.open('https://wa.me/5493425168149', '_blank')}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Contáctanos:</p>
                <p className="text-muted-foreground">clubmacabras@gmail.com</p>
                <p className="text-muted-foreground">Santa Fe, Argentina</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center space-y-2">
            <p className="text-muted-foreground">
              © 2026 Club Macabras. Plataforma educativa de marroquinería profesional. Desarrollado por <a href="https://lasgurit.netlify.app" target="_blank">GurIT</a>.
            </p>
            <p className="text-sm text-muted-foreground">
              Sitio seguro y confiable • Certificado SSL A+ • Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;