export const surveyPath = {
  get: {
    tags: ['Enquete'],
    summary: 'API para listar todas enquetes',
    description: 'Você **deve enviar o token de acesso gerado na rota de login** para acessar esta rota!',
    security: [
      {
        apiKeyAuth: []
      }
    ],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      404: {
        $ref: '#/components/notFound'
      },
      403: {
        $ref: '#/components/forbiddenError'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
