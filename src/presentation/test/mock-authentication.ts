import { faker } from '@faker-js/faker'
import { Authentication } from '../controllers/login/login/login-controller-protocols'

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params
  authenticationModel = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName()
  }

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
    this.authenticationParams = authentication
    return await Promise.resolve(this.authenticationModel)
  }
}
