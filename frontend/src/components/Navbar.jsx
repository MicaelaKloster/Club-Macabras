import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Phone, Info } from "lucide-react";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuAbierto(false);
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold text-primary">Club Macabras</span>
        </div>

        {/* Enlaces de navegación - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Button
            variant="ghost"
            onClick={() => scrollToSection('sobre-nosotros')}
            className="flex items-center gap-2"
          >
            <Info size={16} />
            Sobre Nosotros
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => scrollToSection('contacto')}
            className="flex items-center gap-2"
          >
            <Phone size={16} />
            Contáctanos
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/registro" className="flex items-center gap-2">
              <User size={16} />
              Registrarme
            </Link>
          </Button>
          
          <Button asChild>
            <Link to="/login">
              Iniciar Sesión
            </Link>
          </Button>
        </div>

        {/* Botón menú hamburguesa - Móvil */}
        <div className="md:hidden">
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
          >
            {menuAbierto ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection('sobre-nosotros')}
            >
              <Info size={16} className="mr-2" />
              Sobre Nosotros
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => scrollToSection('contacto')}
            >
              <Phone size={16} className="mr-2" />
              Contáctanos
            </Button>
            
            <Button 
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link
                to="/registro"
                onClick={() => setMenuAbierto(false)}
              >
                <User size={16} className="mr-2" />
                Registrarme
              </Link>
            </Button>
            
            <Button 
              className="w-full"
              asChild
            >
              <Link
                to="/login"
                onClick={() => setMenuAbierto(false)}
              >
                Iniciar Sesión
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;