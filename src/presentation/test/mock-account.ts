import { mockAccount } from '@/domain/test'
import { AccountModel, AddAccount, AddAccountParams } from '../controllers/login/signup/signup-controller-protocols'
import { LoadAccountByToken } from '../middlewares/auth-middleware-protocols'

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccountParams
  account = mockAccount()
  async add (account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account

    return await Promise.resolve(this.account)
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
