import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Users, BookOpen, Shield } from 'lucide-react';

const AcercaDe = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">Acerca de Club Macabras</h1>
                    <p className="text-xl text-muted-foreground">
                        Tu plataforma de confianza para aprender marroquinería profesional
                    </p>
                </div>

                {/* Nuestra Historia */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Nuestra Historia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg leading-relaxed">
                            Club Macabras nació de la pasión por preservar y enseñar el arte tradicional 
                            de la marroquinería. Somos una plataforma educativa dedicada exclusivamente 
                            a formar artesanos en las técnicas profesionales del trabajo con cuero.
                        </p>
                    </CardContent>
                </Card>

                {/* Nuestra Misión */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Nuestra Misión
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p>
                                Democratizar el acceso a la educación en marroquinería, proporcionando 
                                cursos de alta calidad que van desde técnicas básicas hasta 
                                especializaciones avanzadas.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6 mt-6">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                        <BookOpen className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">Educación de Calidad</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Cursos estructurados con metodología profesional
                                    </p>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                        <Users className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">Comunidad</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Red de artesanos y estudiantes apasionados
                                    </p>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                        <Shield className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">Confianza</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Plataforma segura y confiable para tu aprendizaje
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Qué Ofrecemos */}
                <Card>
                    <CardHeader>
                        <CardTitle>¿Qué Ofrecemos?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">📚 Cursos Especializados</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    <li>Técnicas básicas de marroquinería</li>
                                    <li>Trabajo con diferentes tipos de cuero</li>
                                    <li>Herramientas y equipamiento profesional</li>
                                    <li>Proyectos prácticos paso a paso</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">🎯 Metodología Práctica</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    <li>Videos demostrativos de alta calidad</li>
                                    <li>Guías descargables en PDF</li>
                                    <li>Evaluaciones de progreso</li>
                                    <li>Soporte de la comunidad</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Información Legal */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información Legal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div>
                                <strong>Plataforma Educativa:</strong> Club Macabras
                            </div>
                            <div>
                                <strong>Tipo de Servicio:</strong> Educación en línea especializada en marroquinería
                            </div>
                            <div>
                                <strong>Tecnología:</strong> Plataforma web segura con certificación SSL A+
                            </div>
                            <div>
                                <strong>Privacidad:</strong> Cumplimos con estándares internacionales de protección de datos
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contacto */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contacto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p><strong>Sitio web:</strong> https://clubmacabras.netlify.app</p>
                            <p><strong>Soporte:</strong> clubmacabras@gmail.com</p>
                            <p><strong>Información general:</strong> clubmacabras@gmail.com</p>
                            <p className="text-muted-foreground text-sm mt-4">
                                Plataforma educativa dedicada exclusivamente a la enseñanza 
                                de marroquinería profesional. Sitio 100% seguro y confiable.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AcercaDe;