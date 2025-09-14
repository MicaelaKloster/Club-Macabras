import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  BookOpen, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  User, 
  Settings, 
  Bell, 
  LogOut,
  Menu,
  X
} from "lucide-react";

const Header = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [preguntasPendientes, setPreguntasPendientes] = useState(0);
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const obtenerPreguntasPendientes = async () => {
            if(usuario?.rol !== "admin") return;

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/preguntas`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const sinResponder = res.data.filter((p) => !p.respuesta);
                setPreguntasPendientes(sinResponder.length);
            } catch (error) {
                console.error("Error al obtener preguntas pendientes:", error);
            }
        };

        obtenerPreguntasPendientes();
        const interval = setInterval(obtenerPreguntasPendientes, 60000);
        return () => clearInterval(interval);

    }, [usuario]);

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token");
        navigate("/");
    };

    const NavItem = ({ to, icon: Icon, children, onClick, badge = null }) => (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors relative ${
                    isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`
            }
        >
            <Icon size={18} />
            <span className="hidden sm:inline">{children}</span>
            {badge && (
                <Badge variant="destructive" className="ml-1 min-w-[1.25rem] h-5 px-1 text-xs">
                    {badge}
                </Badge>
            )}
        </NavLink>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">Club Macabras</span>
                </Link>

                {/* Navegación Desktop */}
                <nav className="hidden md:flex items-center space-x-1">
                    <NavItem to="/dashboard" icon={BookOpen}>
                        Cursos
                    </NavItem>
                    
                    <NavItem to="/foro" icon={MessageSquare}>
                        Foro
                    </NavItem>
                    
                    <NavItem to="/info-extra" icon={FileText}>
                        Info Extra
                    </NavItem>
                    
                    {usuario?.rol !== "admin" && (
                        <NavItem to="/membresia" icon={CreditCard}>
                            Membresía
                        </NavItem>
                    )}
                    
                    <NavItem to="/perfil" icon={User}>
                        Perfil
                    </NavItem>

                    {usuario?.rol === "admin" && (
                        <NavItem 
                            to="/admin" 
                            icon={Settings}
                            badge={preguntasPendientes > 0 ? preguntasPendientes : null}
                        >
                            Admin
                        </NavItem>
                    )}
                </nav>

                {/* Botones de usuario - Desktop */}
                <div className="hidden md:flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        Hola, {usuario?.nombre}
                    </span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleLogout}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <LogOut size={16} className="mr-2" />
                        Salir
                    </Button>
                </div>

                {/* Botón menú móvil */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
                >
                    {menuMovilAbierto ? <X size={20} /> : <Menu size={20} />}
                </Button>
            </div>

            {/* Menú móvil */}
            {menuMovilAbierto && (
                <div className="md:hidden border-t bg-background">
                    <div className="container px-4 py-4 space-y-2">
                        {/* Usuario info */}
                        <div className="pb-3 mb-3 border-b">
                            <p className="text-sm font-medium">{usuario?.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                                {usuario?.rol === "admin" ? "Administrador" : "Miembro"}
                            </p>
                        </div>

                        {/* Navegación móvil */}
                        <div className="space-y-1">
                            <NavItem to="/dashboard" icon={BookOpen}>
                                Cursos
                            </NavItem>
                            
                            <NavItem to="/foro" icon={MessageSquare}>
                                Foro de la Comunidad
                            </NavItem>
                            
                            <NavItem to="/info-extra" icon={FileText}>
                                Info Extra
                            </NavItem>
                            
                            {usuario?.rol !== "admin" && (
                                <NavItem to="/membresia" icon={CreditCard}>
                                    Membresía
                                </NavItem>
                            )}
                            
                            <NavItem to="/perfil" icon={User}>
                                Mi Perfil
                            </NavItem>

                            {usuario?.rol === "admin" && (
                                <NavItem 
                                    to="/admin" 
                                    icon={Settings}
                                    badge={preguntasPendientes > 0 ? preguntasPendientes : null}
                                >
                                    Panel Admin
                                </NavItem>
                            )}
                        </div>

                        {/* Cerrar sesión móvil */}
                        <div className="pt-3 mt-3 border-t">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleLogout}
                                className="w-full justify-start text-muted-foreground hover:text-foreground"
                            >
                                <LogOut size={16} className="mr-2" />
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;