import swaggerJSDoc from 'swagger-jsdoc'

export const apiSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Libertadnt',
      version: '1.0.0',
      description: '**Aplicacion web para gestionar tu carcel de la manera mas confiable**',
      contact: {
        dev1: 'Ignacio Koffler',
        dev2: 'Gonzalo Carrizo'
      },
      server: {
        url: 'http://localhost:8080',
        description: 'local server'
      }
    }
  },
  apis: ['./**/*.routes.yaml']
})


