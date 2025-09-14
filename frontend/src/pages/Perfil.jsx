import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { ArrowLeft, User, Mail, MapPin, Edit3, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

const Perfil = () => {
    const [perfil, setPerfil] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const obtenerPerfil = async () => {
        const token = localStorage.getItem("token");

        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/perfil`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPerfil(data);
        } catch (error) {
            console.error("⚠ Error al obtener perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerPerfil();
    }, []);

    useEffect(() => {
        if (location.state?.actualizado) {
            obtenerPerfil(); 
        }
    }, [location.state]);

    const profileFields = [
        {
            label: "Nombre",
            value: perfil.nombre,
            icon: User,
            color: "text-blue-600"
        },
        {
            label: "Email", 
            value: perfil.email,
            icon: Mail,
            color: "text-green-600"
        },
        {
            label: "Provincia",
            value: perfil.provincia || "No especificada",
            icon: MapPin,
            color: "text-orange-600"
        },
        {
            label: "Ciudad",
            value: perfil.ciudad || "No especificada", 
            icon: MapPin,
            color: "text-purple-600"
        }
    ];

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-6">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-20" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-10 w-32 mt-6" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver atrás
                </Button>
            </div>

            {/* Profile Card */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-pink-600 flex items-center">
                            <User className="h-7 w-7 mr-3" />
                            Mi perfil
                        </CardTitle>
                        <Badge variant="secondary" className="text-sm">
                            Usuario
                        </Badge>
                    </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                    {/* Profile Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {profileFields.map((field, index) => {
                            const IconComponent = field.icon;
                            return (
                                <div 
                                    key={index}
                                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className={`p-2 rounded-full bg-white ${field.color}`}>
                                        <IconComponent className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-600">{field.label}:</p>
                                        <p className="text-base text-gray-900 truncate">
                                            {field.value}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Edit Profile Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            onClick={() => navigate("/perfil/editar")}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2 text-base"
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Editar Perfil
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Perfil;