import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
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
            Aprende el Arte de la{' '}
            <span className="text-primary-foreground">Marroquinería</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 leading-relaxed text-white/90">
            Descubre técnicas tradicionales y modernas para crear piezas únicas en cuero. 
            Únete a nuestra comunidad de artesanos apasionados.
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
                    <span>info@clubmacabras.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary" size={20} />
                    <span>+54 9 11 1234-5678</span>
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
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Club Macabras</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tu academia online de marroquinería. Aprende, crea y forma parte 
                de nuestra comunidad de artesanos.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
              <nav className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start p-0 h-auto" asChild>
                  <Link to="/registro">Registrarme</Link>
                </Button>
                <Button variant="ghost" className="justify-start p-0 h-auto" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start p-0 h-auto"
                  onClick={() => scrollToSection('sobre-nosotros')}
                >
                  Sobre Nosotros
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
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                  <Facebook size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                  <Instagram size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                  <Twitter size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                  <Youtube size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center">
            <p className="text-muted-foreground">
              © 2025 Club Macabras. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;