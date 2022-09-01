import { mockAccount } from '@/domain/test'
import { AddAccount } from '../controllers/login/signup/signup-controller-protocols'
import { AccountModel, LoadAccountByToken } from '../middlewares/auth-middleware-protocols'

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccount.Params
  isValid = true
  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account

    return await Promise.resolve(this.isValid)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role: string
  account = mockAccount()
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return await Promise.resolve(this.account)
  }
}
