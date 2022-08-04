export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API para autenticar usuário',
    description: 'Basicamente autentica o usuário e retorna o **token de acesso** utilizando o **email e a senha**.',
    requestBody: {
      description: 'Dados do usuário para autenticar',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      404: {
        $ref: '#/components/notFound'
      },
      401: {
        $ref: '#/components/unauthorizedError'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
