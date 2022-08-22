import { faker } from '@faker-js/faker'
import { Authentication, AuthenticationParams } from '../controllers/login/login/login-controller-protocols'

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  ciphertext = faker.datatype.uuid()

  async auth (authentication: AuthenticationParams): Promise<string> {
    this.authenticationParams = authentication
    return await Promise.resolve(this.ciphertext)
  }
}
