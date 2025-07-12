import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
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

import {ejecutarVerificacionDeMembresias} from './jobs/verificarMembresias.job.js';


// Configurar dotenv
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// RUTAS
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
