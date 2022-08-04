import { serverError, unauthorizedError, badRequest, notFound } from './components'
import { loginPath } from './paths'
import { accountSchema, errorSchema, loginParamsSchema } from './schemas'

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description:
      'API desenvolvida no [curso de NodeJS](https://www.udemy.com/course/tdd-com-mango).',
    version: '1.0.0'
  },
  license: {
    name: 'ISC',
    url: 'https://opensource.org/licenses/ISC'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Login'
    }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    serverError,
    unauthorizedError,
    notFound
  }
}
