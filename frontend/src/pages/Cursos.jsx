import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookOpen, Calendar, ArrowRight, Users, Clock, Loader2 } from "lucide-react";

const Cursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerCursos = async () => {
            try{
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/cursos`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                setCursos(data.cursos);
            
            }catch (error) {
                console.error("Error al obtener los cursos: ", error);
            } finally{
                setLoading(false);
            }
        };
        obtenerCursos();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Cargando cursos...</span>
                </div>
            </div>
        );
    }

    if (!cursos || cursos.length === 0) {
        return (
            <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay cursos disponibles
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Los cursos aparecerán aquí cuando estén disponibles. 
                    Mantente atento a las novedades.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header de la página */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                    Cursos Disponibles
                </h1>
                <p className="text-muted-foreground">
                    Descubre nuestros cursos de marroquinería y desarrolla tus habilidades artesanales
                </p>
            </div>

            {/* Grid de cursos */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cursos.map((curso) => (
                    <Card 
                        key={curso.id} 
                        className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20 overflow-hidden"
                    >
                        {/* Imagen de portada */}
                        <div className="relative overflow-hidden">
                            {curso.imagen_portada ? (
                                <img 
                                    src={curso.imagen_portada} 
                                    alt={curso.titulo}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            {/* Fallback cuando no hay imagen o no carga */}
                            <div 
                                className={`w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center ${curso.imagen_portada ? 'hidden' : 'flex'}`}
                            >
                                <BookOpen className="h-16 w-16 text-pink-400" />
                            </div>
                        </div>

                        <CardHeader className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="w-fit">
                                    {curso.categoria || "General"}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {new Date(curso.creado_en).toLocaleDateString('es-AR', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                                    {curso.titulo}
                                </CardTitle>
                                <CardDescription className="mt-2 line-clamp-3">
                                    {curso.descripcion || "Descubre las técnicas y secretos de la marroquinería profesional."}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="h-4 w-4" />
                                        <span>Lecciones</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>Comunidad</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>A tu ritmo</span>
                                    </div>
                                </div>

                                <Button 
                                    asChild 
                                    className="w-full group-hover:bg-primary/90 transition-colors"
                                >
                                    <Link to={`/cursos/${curso.id}`}>
                                        <span>Ver curso</span>
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Footer informativo */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <div className="text-center space-y-2">
                    <h3 className="font-semibold text-foreground">
                        ¿No encuentras lo que buscas?
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                        Nuestros cursos se actualizan constantemente. Si tienes sugerencias o 
                        te gustaría ver un tema específico, no dudes en contactarnos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                        <Button variant="outline" asChild>
                            <Link to="/foro">
                                Únete al foro
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/info-extra">
                                Información adicional
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cursos;