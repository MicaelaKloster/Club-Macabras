import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const PoliticaPrivacidad = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Política de Privacidad</CardTitle>
                    <p className="text-muted-foreground">
                        Última actualización: {new Date().toLocaleDateString('es-AR')}
                    </p>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <h2>1. Información que recopilamos</h2>
                    <p>
                        En Club Macabras recopilamos únicamente la información necesaria para 
                        proporcionar nuestros servicios educativos de marroquinería:
                    </p>
                    <ul>
                        <li><strong>Información de registro:</strong> Nombre, email para crear tu cuenta</li>
                        <li><strong>Progreso educativo:</strong> Lecciones completadas, avances en cursos</li>
                        <li><strong>Información técnica:</strong> Datos de navegación para mejorar la experiencia</li>
                    </ul>

                    <h2>2. Cómo usamos tu información</h2>
                    <ul>
                        <li>Proporcionar acceso a nuestros cursos de marroquinería</li>
                        <li>Personalizar tu experiencia de aprendizaje</li>
                        <li>Comunicarnos contigo sobre actualizaciones del curso</li>
                        <li>Mejorar nuestros servicios educativos</li>
                    </ul>

                    <h2>3. Protección de datos</h2>
                    <p>
                        Utilizamos medidas de seguridad estándar de la industria para proteger 
                        tu información personal:
                    </p>
                    <ul>
                        <li>Cifrado SSL/TLS para todas las comunicaciones</li>
                        <li>Almacenamiento seguro en Supabase con encriptación</li>
                        <li>Acceso limitado a datos personales</li>
                    </ul>

                    <h2>4. Compartir información</h2>
                    <p>
                        <strong>No vendemos, alquilamos ni compartimos</strong> tu información personal 
                        con terceros, excepto:
                    </p>
                    <ul>
                        <li>Cuando sea requerido por ley</li>
                        <li>Para proteger nuestros derechos legítimos</li>
                        <li>Con tu consentimiento explícito</li>
                    </ul>

                    <h2>5. Tus derechos</h2>
                    <p>Tienes derecho a:</p>
                    <ul>
                        <li>Acceder a tu información personal</li>
                        <li>Corregir datos incorrectos</li>
                        <li>Eliminar tu cuenta y datos</li>
                        <li>Exportar tus datos</li>
                    </ul>

                    <h2>6. Cookies</h2>
                    <p>
                        Utilizamos cookies técnicas necesarias para el funcionamiento del sitio 
                        y para mantener tu sesión iniciada de forma segura.
                    </p>

                    <h2>7. Contacto</h2>
                    <p>
                        Si tienes preguntas sobre esta política de privacidad, contáctanos en:
                        <br />
                        <strong>Email:</strong> clubmacabras@gmail.com
                        <br />
                        <strong>Sitio web:</strong> clubmacabras.netlify.app
                    </p>

                    <h2>8. Cambios en la política</h2>
                    <p>
                        Nos reservamos el derecho de actualizar esta política. Los cambios 
                        significativos serán notificados por email o mediante aviso en el sitio.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default PoliticaPrivacidad;