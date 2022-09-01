import { AccountModel } from '@/domain/models/account'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { faker } from '@faker-js/faker'
import { Authentication } from '../usecases/account/authentication'

export function mockAddAccountParams (): AddAccount.Params {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

export function mockAccount (): AccountModel {
  return Object.assign({}, mockAddAccountParams(), { id: faker.datatype.uuid() })
}

export function mockAuthentication (): Authentication.Params {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}
