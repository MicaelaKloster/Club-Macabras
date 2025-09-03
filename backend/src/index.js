import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import usuariosRoutes from './routes/usuarios.routes.js';
import authRoutes from './routes/auth.routes.js';
import perfilRoutes from './routes/perfil.routes.js';
import cursosRoutes from './routes/cursos.routes.js';
import videosRoutes from './routes/videos.routes.js';
import documentosRoutes from './routes/documentos.routes.js';
import membresiasRoutes from './routes/membresias.routes.js';
import temasForoRoutes from './routes/temasForo.routes.js';
import respuestasForoRoutes from './routes/respuestasForo.routes.js';
import preguntasRoutes from './routes/preguntas.routes.js';
import mensajesRoutes from './routes/mensajes.routes.js'
import trabajosRoutes from './routes/trabajos.routes.js';
import likesRoutes from './routes/likes.routes.js';
import progresoRoutes from './routes/progreso.routes.js';
import mercadoPagoRoutes from './routes/mercadoPago.routes.js';

import {ejecutarVerificacionDeMembresias} from './jobs/verificarMembresias.job.js';


// Configurar dotenv
dotenv.config();

const app = express();

// Confiar en proxies (ngrok)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configurar ruta para archivos estáticos (uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// RUTAS
app.use(express.json({ type: '*/*' })); // Importante para recibir Webhooks

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/perfil', perfilRoutes);
app.use('/api/v1/cursos', cursosRoutes);
app.use('/api/v1/videos', videosRoutes);
app.use('/api/v1/documentos', documentosRoutes);
app.use('/api/v1/membresias', membresiasRoutes);
app.use('/api/v1/temas-foro', temasForoRoutes);
app.use('/api/v1/temas-foro', respuestasForoRoutes);
app.use('/api/v1/preguntas', preguntasRoutes);
app.use('/api/v1/mensajes', mensajesRoutes);
app.use('/api/v1/trabajos', trabajosRoutes);
app.use('/api/v1', likesRoutes);
app.use('/api/v1', progresoRoutes);
app.use('/api/v1/mercadopago', mercadoPagoRoutes);
// Servir la carpeta uploads de forma pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Club Macabras - API funcionando ✅');
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  
  // Ejecutar verificación de membresías al iniciar
  ejecutarVerificacionDeMembresias();
});
