export const signupPath = {
  post: {
    tags: ['Login'],
    summary: 'API para cadastrar um usuário',
    description: 'Cadastra um usuário.',
    requestBody: {
      description: 'Dados do usuário que será cadastrado',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signupParams'
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
      403: {
        $ref: '#/components/forbiddenError'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
