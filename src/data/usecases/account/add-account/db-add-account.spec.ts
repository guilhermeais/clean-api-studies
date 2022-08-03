import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { mockAccount } from '@/domain/test'
import { mockHasher, mockAddAccountRepository, mockLoadAccountEmailByRepository } from '@/data/test'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = mockLoadAccountEmailByRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(null)
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
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

    await sut.add(mockAccount())
    expect(hasherStub.hash).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash')
      .mockRejectedValueOnce(new Error('some_error'))

    const sutPromise = sut.add(mockAccount())
    await expect(sutPromise).rejects.toThrow(new Error('some_error'))
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = mockAccount()
    await sut.add(accountData)
    expect(addAccountRepositoryStub.add).toHaveBeenCalledWith({ ...accountData, password: 'hashed_password' })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error('some_error'))

    const sutPromise = sut.add(mockAccount())
    await expect(sutPromise).rejects.toThrow(new Error('some_error'))
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(mockAccount())
    expect(account).toEqual(mockAccount())
  })

  test('Should return null if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(mockAccount())
    const account = await sut.add(mockAccount())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const fakeAccount = mockAccount()
    await sut.add(fakeAccount)

    expect(loadAccountByEmailRepositoryStub.loadByEmail).toHaveBeenCalledWith(fakeAccount.email)
  })
})
