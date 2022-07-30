import { Authentication, AuthenticationParams } from '../controllers/login/login/login-controller-protocols'

export function mockAuthentication (): Authentication {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}
