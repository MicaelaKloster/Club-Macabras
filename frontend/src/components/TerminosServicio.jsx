import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const TerminosServicio = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Términos de Servicio</CardTitle>
                    <p className="text-muted-foreground">
                        Última actualización: {new Date().toLocaleDateString('es-AR')}
                    </p>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <h2>1. Descripción del Servicio</h2>
                    <p>
                        Club Macabras es una <strong>plataforma educativa especializada en marroquinería</strong> que ofrece:
                    </p>
                    <ul>
                        <li>Cursos online de técnicas de trabajo con cuero</li>
                        <li>Material educativo especializado en marroquinería</li>
                        <li>Comunidad de aprendizaje para artesanos</li>
                        <li>Soporte técnico y educativo</li>
                    </ul>

                    <h2>2. Naturaleza Educativa del Sitio</h2>
                    <p>
                        <strong>Club Macabras es exclusivamente una plataforma educativa.</strong> Nuestro propósito es:
                    </p>
                    <ul>
                        <li>Enseñar técnicas tradicionales y modernas de marroquinería</li>
                        <li>Formar artesanos competentes en el trabajo con cuero</li>
                        <li>Preservar el conocimiento artesanal de la marroquinería</li>
                        <li>Crear una comunidad de aprendizaje segura</li>
                    </ul>

                    <h2>3. Registro y Cuenta de Usuario</h2>
                    <h3>3.1 Proceso de Registro</h3>
                    <p>
                        Para acceder a nuestros cursos, debes crear una cuenta proporcionando:
                    </p>
                    <ul>
                        <li><strong>Nombre completo:</strong> Para personalizar tu experiencia de aprendizaje</li>
                        <li><strong>Email válido:</strong> Para comunicaciones importantes y recuperación de cuenta</li>
                        <li><strong>Contraseña segura:</strong> Para proteger tu cuenta y progreso</li>
                    </ul>

                    <h3>3.2 Seguridad de la Cuenta</h3>
                    <ul>
                        <li>Eres responsable de mantener segura tu contraseña</li>
                        <li>No compartir credenciales con terceros</li>
                        <li>Notificar inmediatamente cualquier uso no autorizado</li>
                        <li>Usar información real y verificable</li>
                    </ul>

                    <h2>4. Uso Legítimo de la Plataforma</h2>
                    <h3>4.1 Propósito Educativo</h3>
                    <p>Te comprometes a usar Club Macabras únicamente para:</p>
                    <ul>
                        <li>Aprender técnicas de marroquinería</li>
                        <li>Participar constructivamente en la comunidad</li>
                        <li>Desarrollar habilidades artesanales</li>
                        <li>Fines educativos y de crecimiento profesional</li>
                    </ul>

                    <h3>4.2 Conducta Prohibida</h3>
                    <p>Queda estrictamente prohibido:</p>
                    <ul>
                        <li>Usar la plataforma para actividades ilegales o fraudulentas</li>
                        <li>Compartir contenido malicioso o dañino</li>
                        <li>Intentar acceder no autorizadamente a otros cuentas</li>
                        <li>Distribuir malware o enlaces sospechosos</li>
                        <li>Suplantar identidad o proporcionar información falsa</li>
                    </ul>

                    <h2>5. Contenido y Propiedad Intelectual</h2>
                    <h3>5.1 Nuestro Contenido</h3>
                    <ul>
                        <li>Todo el material educativo está protegido por derechos de autor</li>
                        <li>Los cursos son para uso personal y educativo únicamente</li>
                        <li>No está permitida la redistribución comercial del contenido</li>
                    </ul>

                    <h3>5.2 Tu Contenido</h3>
                    <ul>
                        <li>Mantienes los derechos sobre tus creaciones y proyectos</li>
                        <li>Al compartir en la comunidad, otorgas licencia de uso no comercial</li>
                        <li>Eres responsable de la originalidad de tu contenido</li>
                    </ul>

                    <h2>6. Pagos y Facturación (Si Aplica)</h2>
                    <h3>6.1 Transparencia en Pagos</h3>
                    <p>Si ofrecemos cursos de pago:</p>
                    <ul>
                        <li>Todos los precios se muestran claramente antes de la compra</li>
                        <li>Procesamos pagos a través de plataformas seguras certificadas</li>
                        <li>No almacenamos información de tarjetas de crédito</li>
                        <li>Proporcionamos recibos por todas las transacciones</li>
                    </ul>

                    <h3>6.2 Política de Reembolsos</h3>
                    <ul>
                        <li>7 días de garantía de satisfacción</li>
                        <li>Reembolso completo si el curso no cumple las expectativas</li>
                        <li>Proceso claro y transparente de devoluciones</li>
                    </ul>

                    <h2>7. Protección de Menores</h2>
                    <p>
                        <strong>Club Macabras está comprometido con la protección de menores:</strong>
                    </p>
                    <ul>
                        <li>Los menores de 18 años requieren supervisión de adultos</li>
                        <li>Reportamos inmediatamente cualquier actividad sospechosa</li>
                        <li>Moderamos activamente todas las interacciones de la comunidad</li>
                        <li>Mantenemos un entorno seguro y apropiado para todas las edades</li>
                    </ul>

                    <h2>8. Medidas de Seguridad</h2>
                    <h3>8.1 Protección de Datos</h3>
                    <ul>
                        <li>Cifrado SSL/TLS en todas las comunicaciones</li>
                        <li>Servidores seguros y actualizados</li>
                        <li>Monitoreo continuo de seguridad</li>
                        <li>Cumplimiento con estándares internacionales</li>
                    </ul>

                    <h3>8.2 Prevención de Fraude</h3>
                    <ul>
                        <li>Verificación automática de actividades sospechosas</li>
                        <li>Sistemas anti-phishing integrados</li>
                        <li>Educación continua sobre seguridad a usuarios</li>
                        <li>Colaboración con autoridades cuando es necesario</li>
                    </ul>

                    <h2>9. Limitación de Responsabilidad</h2>
                    <p>
                        Club Macabras se compromete a proporcionar un servicio educativo de calidad, pero:
                    </p>
                    <ul>
                        <li>No garantizamos resultados específicos de aprendizaje</li>
                        <li>Los usuarios son responsables de su progreso educativo</li>
                        <li>No somos responsables de decisiones comerciales basadas en nuestros cursos</li>
                        <li>Limitamos nuestra responsabilidad al valor pagado por el servicio</li>
                    </ul>

                    <h2>10. Terminación del Servicio</h2>
                    <h3>10.1 Por Parte del Usuario</h3>
                    <ul>
                        <li>Puedes cancelar tu cuenta en cualquier momento</li>
                        <li>Exportación de datos disponible antes de la eliminación</li>
                        <li>Eliminación completa de datos personales upon request</li>
                    </ul>

                    <h3>10.2 Por Nuestra Parte</h3>
                    <p>Nos reservamos el derecho de suspender cuentas que:</p>
                    <ul>
                        <li>Violen estos términos de servicio</li>
                        <li>Pongan en riesgo la seguridad de otros usuarios</li>
                        <li>Usen la plataforma para actividades ilegales</li>
                    </ul>

                    <h2>11. Modificaciones a los Términos</h2>
                    <ul>
                        <li>Nos reservamos el derecho de actualizar estos términos</li>
                        <li>Los cambios significativos serán notificados con 30 días de anticipación</li>
                        <li>El uso continuado implica aceptación de los nuevos términos</li>
                    </ul>

                    <h2>12. Ley Aplicable y Jurisdicción</h2>
                    <p>
                        Estos términos se rigen por las leyes de Argentina. 
                        Cualquier disputa será resuelta en los tribunales de Santa Fe, Argentina.
                    </p>

                    <h2>13. Contacto</h2>
                    <p>
                        Para preguntas sobre estos términos de servicio:
                        <br />
                        <strong>Email:</strong> legal@clubmacabras.com
                        <br />
                        <strong>Email de soporte:</strong> soporte@clubmacabras.com
                        <br />
                        <strong>Sitio web:</strong> https://clubmacabras.netlify.app
                    </p>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
                        <h3 className="text-green-800 font-semibold mb-2">🛡️ Compromiso de Seguridad</h3>
                        <p className="text-green-700 text-sm">
                            Club Macabras es una plataforma educativa 100% legítima y segura. 
                            Contamos con certificación SSL A+, cumplimos con estándares 
                            internacionales de seguridad y estamos comprometidos con la 
                            protección de nuestros usuarios y sus datos.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TerminosServicio;