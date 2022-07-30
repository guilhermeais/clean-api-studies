import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticationParams } from '../usecases/account/authentication'

export function mockAddAccountParams (): AddAccountParams {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

export function mockAccount (): AccountModel {
  return Object.assign({}, mockAddAccountParams(), { id: 'any_id' })
}

export function mockAuthentication (): AuthenticationParams {
  return {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}
