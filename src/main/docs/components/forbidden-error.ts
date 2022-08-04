export const forbiddenError = {
  description: 'Acesso negado',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
