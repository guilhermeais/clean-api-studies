import { mockAccount } from '@/domain/test'
import { AddAccountRepository } from '../protocols/db/account/add-account-repository'
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository'
import { AccountModel, LoadAccountByEmailRepository } from '../usecases/account/add-account/db-add-account-protocols'

export class AddAccountRepositorySpy implements AddAccountRepository {
  account = mockAccount()
  addAccountParams: AddAccountRepository.Params
  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = accountData
    return await Promise.resolve(this.account)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  account = mockAccount()
  email: string
  async loadByEmail (email: string): Promise<AccountModel> {
    this.email = email
    return await Promise.resolve(this.account)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  account = mockAccount()
  token: string
  role: string

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    this.token = token
    this.role = role

    return await Promise.resolve(this.account)
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
