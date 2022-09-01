import {
  AddAccount,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
  AccountModel
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const accountExists = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email
    )
    let newAccount: AccountModel = null
    if (!accountExists) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      newAccount = await this.addAccountRepository.add(
        { ...accountData, password: hashedPassword }
      )

      return newAccount !== null
    }

    return false
  }
}
