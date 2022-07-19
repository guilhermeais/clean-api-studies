import { AccountModel, AddAccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

function makeHasher (): Hasher {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  const hasherStub = new HasherStub()
  return hasherStub
}

function makeFakeAddAccount (): AddAccountModel {
  return {
    name: 'valid_name',
    email: 'valid_email@gmail.com',
    password: 'valid_password'
  }
}

function makeLoadAccountEmailByRepository (): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel|null> {
      return await Promise.resolve(null)
    }
  }
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  return loadAccountByEmailRepositoryStub
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
}

function makeAddAccountRepository (): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositoryStub()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountEmailByRepository()
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash')

    await sut.add(makeFakeAddAccount())
    expect(hasherStub.hash).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error('some_error'))))

    const sutPromise = sut.add(makeFakeAddAccount())
    await expect(sutPromise).rejects.toThrow(new Error('some_error'))
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeFakeAddAccount()
    await sut.add(accountData)
    expect(addAccountRepositoryStub.add).toHaveBeenCalledWith({ ...accountData, password: 'hashed_password' })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error('some_error'))))

    const sutPromise = sut.add(makeFakeAddAccount())
    await expect(sutPromise).rejects.toThrow(new Error('some_error'))
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAddAccount())
    expect(account).toEqual(makeFakeAccount())
  })

  test('Should return null if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(makeFakeAccount())
    const account = await sut.add(makeFakeAddAccount())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const fakeAccount = makeFakeAccount()
    await sut.add(fakeAccount)

    expect(loadAccountByEmailRepositoryStub.loadByEmail).toHaveBeenCalledWith(fakeAccount.email)
  })
})
