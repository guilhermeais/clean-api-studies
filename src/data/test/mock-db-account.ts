import { mockAccount } from '@/domain/test'
import { AddAccountRepository } from '../protocols/db/account/add-account-repository'
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository'
import { AccountModel, AddAccountParams, LoadAccountByEmailRepository } from '../usecases/account/add-account/db-add-account-protocols'

export function mockAddAccountRepository (): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new AddAccountRepositoryStub()
}

export function mockLoadAccountEmailByRepository (): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export function mockLoadAccountByTokenRepository (): LoadAccountByTokenRepository {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

export function mockUpdateAccessTokenRepository (): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}
