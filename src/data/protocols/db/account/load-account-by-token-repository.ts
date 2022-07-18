import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export interface LoadAccountByTokenRepository {
  loadByToken: (token: string, role?: string) => Promise<AccountModel|null>
}
