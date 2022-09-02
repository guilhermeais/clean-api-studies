import { faker } from '@faker-js/faker'
import { AddAccountRepository } from '../protocols/db/account/add-account-repository'
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository'
import { LoadAccountByEmailRepository } from '../usecases/account/add-account/db-add-account-protocols'

export class AddAccountRepositorySpy implements AddAccountRepository {
  isValid = true
  addAccountParams: AddAccountRepository.Params
  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = accountData
    return await Promise.resolve(this.isValid)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    password: faker.internet.password()
  }

  email: string
  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return await Promise.resolve(this.result)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  result = {
    id: faker.datatype.uuid()
  }

  loadAccountByTokenRepositoryParams: LoadAccountByTokenRepository.Params

  async loadByToken (loadAccountByTokenRepositoryParams: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Result> {
    this.loadAccountByTokenRepositoryParams = loadAccountByTokenRepositoryParams

    return await Promise.resolve(this.result)
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string
  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
    return await Promise.resolve()
  }
}
