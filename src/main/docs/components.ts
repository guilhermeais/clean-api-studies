import {
  serverError,
  unauthorizedError,
  badRequest,
  notFound,
  forbiddenError
} from './components/'

import { apiKeyAuthSchema } from './schemas/'

export const components = {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  serverError,
  unauthorizedError,
  notFound,
  forbiddenError
}
