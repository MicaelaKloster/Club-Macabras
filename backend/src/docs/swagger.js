import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API - Club Macabras',
    version: '1.0.0',
    description: 'Documentación de la API del proyecto Club Macabras 💼🧵',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
        securitySchemes: {
            bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
            }
        }
    },
    security: [{
    bearerAuth: []
    }]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // 📌 Documentamos desde los archivos de rutas
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
