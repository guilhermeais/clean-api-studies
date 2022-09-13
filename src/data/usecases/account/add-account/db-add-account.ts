import {
  AddAccount,
  AddAccountRepository,
  Hasher,
  CheckAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: CheckAccountByEmailRepository
  ) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const accountExists = await this.loadAccountByEmailRepository.checkByEmail(
      accountData.email
    )

    let isValid = false
    if (!accountExists) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      isValid = await this.addAccountRepository.add(
        { ...accountData, password: hashedPassword }
      )
    }
    return isValid
  }
}
