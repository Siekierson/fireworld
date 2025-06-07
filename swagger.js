const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fireworld API',
      version: '1.0.0',
      description: 'Dokumentacja API dla Fireworld',
    },
  },
apis: ['./src/app/api/**/*.ts'] // <-- ważne, by objąć wszystkie route.ts
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;