import { mockAccount } from '@/domain/test'
import { AccountModel, AddAccount, AddAccountParams } from '../controllers/login/signup/signup-controller-protocols'
import { LoadAccountByToken } from '../middlewares/auth-middleware-protocols'

export function mockAddAccount (): AddAccount {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      const fakeAccount = mockAccount()

      return await Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountStub()
}

export function mockLoadAccountByToken (): LoadAccountByToken {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByTokenStub()
}
