import { faker } from '@faker-js/faker'
import { AddAccount } from '../controllers/login/signup/signup-controller-protocols'
import { LoadAccountByToken } from '../middlewares/auth-middleware-protocols'

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccount.Params
  isValid = true
  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account

    return await Promise.resolve(this.isValid)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  loadAccountByTokenParams: LoadAccountByToken.Params
  result = {
    id: faker.datatype.uuid()
  }

  async load (loadAccountByTokenParams: LoadAccountByToken.Params): Promise<LoadAccountByToken.Result> {
    this.loadAccountByTokenParams = loadAccountByTokenParams
    return await Promise.resolve(this.result)
  }
}
