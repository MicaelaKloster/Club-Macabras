# Club Macabras

## Descripción

Club Macabras es una plataforma educativa especializada en marroquinería y trabajos en cuero. La aplicación web permite a los usuarios acceder a cursos premium, participar en una comunidad activa y gestionar su progreso de aprendizaje mediante un sistema de membresías.

## Características Principales

### Para Estudiantes
- **Sistema de membresías**: Acceso premium a contenido exclusivo
- **Cursos multimedia**: Videos educativos con seguimiento de progreso
- **Recursos descargables**: Documentos, patrones y materiales complementarios
- **Sistema de Q&A**: Preguntas y respuestas directas con instructores
- **Foro comunitario**: Espacio de intercambio entre estudiantes
- **Galería de trabajos**: Exposición de creaciones de la comunidad

### Para Administradores
- **Gestión de contenido**: Administración completa de cursos y materiales
- **Gestión de usuarios**: Control de membresías y perfiles
- **Sistema de respuestas**: Panel para responder consultas de estudiantes
- **Moderación del foro**: Gestión de temas y respuestas comunitarias
- **Configuración dinámica**: Ajuste de precios y información del sistema

## Arquitectura Técnica

### Frontend
- **Framework**: React 18 con Vite
- **UI/UX**: Tailwind CSS con componentes personalizados
- **Routing**: React Router DOM
- **Estado global**: Context API
- **Iconografía**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Validaciones**: Express Validator
- **Documentación**: Swagger/OpenAPI

### Funcionalidades del Sistema

#### Gestión de Usuarios
- Registro y autenticación segura
- Perfiles personalizables con ubicación
- Sistema de roles (usuario/administrador)
- Gestión de membresías con estados activos/vencidos

#### Sistema de Cursos
- Organización por categorías
- Videos embebidos de YouTube
- Marcado de progreso por video
- Cálculo automático de porcentaje completado
- Recursos descargables organizados

#### Comunidad Interactiva
- Foro general con temas y respuestas
- Sistema de Q&A por curso
- Funciones CRUD completas para contenido propio
- Moderación administrativa

#### Integración de Pagos
- Procesamiento via MercadoPago
- Gestión automática de estados de membresía
- Historial de transacciones
- Precios configurables desde el panel admin

#### Panel Administrativo
- Dashboard con estadísticas
- Gestión completa de contenido
- Panel de preguntas pendientes
- Configuración de sistema en tiempo real

## Estructura del Proyecto

### Backend (`/backend`)
```
├── config/          # Configuración de base de datos
├── controllers/     # Lógica de controladores
├── middlewares/     # Middlewares de autenticación y validación
├── routes/          # Definición de rutas API
├── services/        # Lógica de negocio y acceso a datos
├── validations/     # Esquemas de validación
└── server.js        # Punto de entrada del servidor
```

### Frontend (`/frontend`)
```
├── src/
│   ├── components/  # Componentes reutilizables
│   ├── context/     # Context providers
│   ├── pages/       # Páginas principales de la aplicación
│   └── App.jsx      # Componente raíz
├── public/          # Recursos estáticos
└── index.html       # Página HTML base
```

## API Endpoints Principales

### Autenticación
- `POST /api/v1/auth/registro` - Registro de usuarios
- `POST /api/v1/auth/login` - Inicio de sesión
- `GET /api/v1/perfil` - Obtener perfil del usuario

### Cursos
- `GET /api/v1/cursos` - Listar cursos disponibles
- `GET /api/v1/cursos/:id/materiales` - Obtener materiales del curso
- `POST /api/v1/progreso` - Marcar progreso en videos

### Preguntas y Respuestas
- `POST /api/v1/preguntas` - Crear pregunta
- `GET /api/v1/preguntas/curso/:id` - Obtener preguntas por curso
- `PUT /api/v1/preguntas/:id/responder` - Responder pregunta (admin)
- `PUT /api/v1/preguntas/:id/editar` - Editar pregunta propia
- `DELETE /api/v1/preguntas/:id` - Eliminar pregunta

### Foro Comunitario
- `GET /api/v1/temas-foro` - Listar temas del foro
- `POST /api/v1/temas-foro` - Crear nuevo tema
- `GET /api/v1/temas-foro/:id` - Obtener tema con respuestas
- `PUT /api/v1/temas-foro/:id` - Editar tema propio
- `DELETE /api/v1/temas-foro/:id` - Eliminar tema

### Membresías
- `GET /api/v1/membresias/:id` - Verificar estado de membresía
- `POST /api/v1/mercadopago/preferencia` - Crear preferencia de pago

## Seguridad y Permisos

### Sistema de Autenticación
- Tokens JWT con expiración configurable
- Middleware de verificación en rutas protegidas
- Validación de roles por endpoint

### Control de Acceso
- **Usuarios regulares**: Acceso a contenido según membresía activa
- **Administradores**: Acceso completo a gestión y moderación
- **Contenido gratuito**: Disponible sin membresía

### Validaciones
- Sanitización de inputs del usuario
- Validación de tipos y formatos de datos
- Protección contra inyección SQL mediante queries parametrizadas

## Características Destacadas

### Responsividad Completa
- Interfaz adaptable a dispositivos móviles y desktop
- Componentes optimizados para diferentes tamaños de pantalla
- Navegación intuitiva en todas las plataformas

### Sistema de Notificaciones
- Badges de preguntas pendientes para administradores
- Alertas contextuales para acciones del usuario
- Estados de carga y feedback visual

### Optimización de Performance
- Carga lazy de componentes
- Optimización de consultas a base de datos
- Cacheo de recursos estáticos

### Experiencia de Usuario
- Interfaz moderna con gradientes y transiciones suaves
- Feedback inmediato en todas las interacciones
- Estados de carga y error bien definidos

## Stack Tecnológico Detallado

**Frontend:**
- React 18, React Router DOM, Context API
- Tailwind CSS, Lucide React
- Axios para HTTP requests
- Componentes UI personalizados

**Backend:**
- Node.js, Express.js
- PostgreSQL con queries nativas
- JWT para autenticación
- Express Validator para validaciones
- Swagger para documentación API

**Integraciones:**
- MercadoPago para procesamiento de pagos
- YouTube para hosting de videos educativos
- Servicios de almacenamiento en la nube para recursos

## Estado del Proyecto

Este proyecto está en estado de producción, desarrollado como solución personalizada para Club Macabras. La aplicación incluye todas las funcionalidades necesarias para la gestión de una plataforma educativa especializada, con enfoque en la experiencia del usuario y la facilidad de administración.
