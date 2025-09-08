import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, BookOpen, MessageCircleQuestion, Settings, ArrowRight, Eye, MessageSquare, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DashboardAdmin = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const adminCards = [
        {
            title: "Gestión de Usuarios",
            description: "Administrar cuentas de usuarios",
            icon: Users,
            route: "/admin/usuarios",
            color: "bg-pink-600 hover:bg-pink-700",
            textColor: "text-pink-100"
        },
        {
            title: "Gestión de Cursos", 
            description: "Crear, editar y eliminar cursos",
            icon: BookOpen,
            route: "/admin/cursos",
            color: "bg-pink-600 hover:bg-pink-700",
            textColor: "text-pink-100"
        },
        {
            title: "Preguntas Pendientes",
            description: "Responder consultas de estudiantes", 
            icon: MessageCircleQuestion,
            route: "/admin/preguntas",
            color: "bg-pink-600 hover:bg-pink-700",
            textColor: "text-pink-100"
        },
        {
            title: "Info Extra & Configuraciones",
            description: "Gestionar información adicional y precios",
            icon: Settings,
            route: "/admin/info-extra", 
            color: "bg-pink-600 hover:bg-pink-700",
            textColor: "text-pink-100"
        }
    ];

    const quickActions = [
        {
            label: "Ver cursos como usuario",
            route: "/dashboard",
            icon: Eye
        },
        {
            label: "Ver foro de la comunidad", 
            route: "/foro",
            icon: MessageSquare
        }
    ];

    return (
        <div className="space-y-6 p-6">
            {/* Back Button */}
            <div className="flex items-center mb-4">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>

            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-pink-600">Panel del Administrador</h1>
                    <Badge variant="secondary" className="text-sm">
                        Administrador
                    </Badge>
                </div>
                <p className="text-muted-foreground">
                    ¡Hola {usuario?.nombre}! Elegí qué querés gestionar:
                </p>
            </div>

            {/* Admin Actions Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {adminCards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                        <Card 
                            key={index}
                            className="cursor-pointer transition-all duration-200 hover:shadow-md border-0"
                        >
                            <CardContent className="p-0">
                                <Button
                                    onClick={() => navigate(card.route)}
                                    className={`${card.color} w-full h-full text-white rounded-lg p-6 text-left flex flex-col items-start space-y-3 min-h-[120px]`}
                                    variant="ghost"
                                >
                                    <IconComponent className="h-8 w-8 mb-2" />
                                    <div className="space-y-1">
                                        <div className="font-semibold text-lg">{card.title}</div>
                                        <div className={`${card.textColor} text-sm opacity-90`}>
                                            {card.description}
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 mt-auto ml-auto opacity-70" />
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Access Section */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="text-xl text-gray-700">Acceso rápido</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {quickActions.map((action, index) => {
                            const IconComponent = action.icon;
                            return (
                                <Button
                                    key={index}
                                    onClick={() => navigate(action.route)}
                                    variant="ghost"
                                    className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 p-2 h-auto"
                                >
                                    <IconComponent className="h-4 w-4 mr-2" />
                                    {action.label}
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardAdmin;