import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, CreditCard, Star, Users, BookOpen, MessageSquare, Trophy, ArrowLeft } from "lucide-react";

const ComprarMembresia = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [precioMembresia, setPrecioMembresia] = useState(2000);

  useEffect(() => {
    const obtenerPrecio = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/info-extra/configuraciones`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setPrecioMembresia(res.data.precio_membresia);
      } catch (error) {
        console.error("Error al obtener precio:", error);
      }
    };

    if (usuario) {
      obtenerPrecio();
    }
  }, [usuario]);

  const handleComprar = async () => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/mercadopago/preferencia`,
        {
          usuario_id: usuario.id,
          precio: precioMembresia
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.id) {
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${res.data.id}`;
      } else {
        alert("No se pudo generar la preferencia de pago");
      }
    } catch (error) {
      console.error("Error al crear preferencia:", error);
      alert("Error al iniciar la compra. Intentalo nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const beneficios = [
    {
      icon: BookOpen,
      titulo: "Acceso Completo a Cursos",
      descripcion: "Todos los videos, documentos y materiales de estudio"
    },
    {
      icon: Users,
      titulo: "Comunidad Exclusiva",
      descripcion: "Foro privado para miembros y networking"
    },
    {
      icon: MessageSquare,
      titulo: "Soporte Personalizado",
      descripcion: "Respuestas directas de instructores expertos"
    },
    {
      icon: Trophy,
      titulo: "Certificados de Logro",
      descripcion: "Valida tus habilidades con certificaciones oficiales"
    },
    {
      icon: Star,
      titulo: "Contenido Actualizado",
      descripcion: "Nuevos cursos y técnicas cada mes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              Membresía Premium
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Únete a Club Macabras
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Accede a todo nuestro contenido premium y forma parte de una comunidad 
              apasionada por el arte de la marroquinería
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Beneficios */}
          <Card className="h-fit w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                ¿Qué incluye tu membresía?
              </CardTitle>
              <CardDescription>
                Acceso ilimitado a todo nuestro contenido y comunidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {beneficios.map((beneficio, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                        <beneficio.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {beneficio.titulo}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {beneficio.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Lo que obtienes inmediatamente:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Acceso instantáneo a todos los cursos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Descarga de materiales y patrones
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Participación en el foro de la comunidad
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Soporte directo de instructores
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card de Pago */}
          <Card className="h-fit w-full mx-auto sticky top-8"> {/* Eliminado lg:max-w-md */}
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">
                ${precioMembresia}
              </CardTitle>
              <CardDescription>
                Pago único • Acceso de por vida
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Badge variant="secondary" className="mb-4">
                  Oferta Especial
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Precio de lanzamiento. El valor regular será mayor.
                </p>
              </div>

              <Button 
                onClick={handleComprar}
                className="w-full text-base py-6 truncate"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 overflow-hidden">
                    <CreditCard className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">Comprar Membresía</span>
                  </div>
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Pago seguro procesado por MercadoPago
                </p>
                <p className="text-xs text-muted-foreground">
                  ✅ Satisfacción garantizada o te devolvemos tu dinero
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground text-center">
                  ¿Tienes preguntas? 
                  <br />
                  <span className="text-primary">Contáctanos antes de comprar</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 w-full max-w-6xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">
                Únete a más de 100 artesanos satisfechos
              </h3>
              <p className="text-muted-foreground">
                "Club Macabras transformó mi pasión por el cuero en un negocio próspero. 
                Las técnicas son profesionales y el soporte es excepcional." 
                <span className="font-medium">- María González, Estudiante</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprarMembresia;