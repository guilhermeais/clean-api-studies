export const surveyPath = {
  get: {
    tags: ['Enquete'],
    summary: 'API para listar todas enquetes',
    description:
      'Você **deve enviar o token de acesso gerado na rota de login** para acessar esta rota!',
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
  },
  post: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Enquete'],
    summary: 'API para criar uma enquete',
    description: 'Você deve ser um **admin** para acessar esta rota!',
    requestBody: {
      description: 'Dados para criar uma enquete',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Sucesso'
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
