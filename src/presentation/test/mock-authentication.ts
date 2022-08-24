import { AuthenticationModel } from '@/domain/models/authentication'
import { faker } from '@faker-js/faker'
import { Authentication, AuthenticationParams } from '../controllers/login/login/login-controller-protocols'

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName()
  }

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authentication
    return await Promise.resolve(this.authenticationModel)
  }
}
