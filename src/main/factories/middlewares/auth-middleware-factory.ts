import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { Middleware } from '../../../presentation/protocols'
import { makeDbLoadAccountByToken } from '../usecases/account/load-account-by-token/db-load-account-by-token-factory'

export function makeAuthMiddleware (role?: string): Middleware {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
