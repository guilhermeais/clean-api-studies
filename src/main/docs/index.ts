import {
  serverError,
  unauthorizedError,
  badRequest,
  notFound,
  forbiddenError
} from './components'
import { loginPath, signupPath, surveyPath } from './paths'
import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
  surveySchema,
  surveysSchema,
  surveyAnswerSchema,
  apiKeyAuthSchema,
  signupParamsSchema
} from './schemas'

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
    },
    {
      name: 'Enquete'
    }
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
    '/signup': signupPath
  },
  schemas: {
    account: accountSchema,
    signupParams: signupParamsSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    unauthorizedError,
    notFound,
    forbiddenError
  }
}
