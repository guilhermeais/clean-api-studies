import { AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { mockAccount } from '@/domain/test'
import { HasherSpy, mockAddAccountRepository, mockLoadAccountEmailByRepository } from '@/data/test'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = mockLoadAccountEmailByRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(null)
  const hasherSpy = new HasherSpy()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const sut = new DbAddAccount(hasherSpy, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherSpy,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const account = mockAccount()
    await sut.add(account)
    expect(hasherSpy.plaintext).toBe(account.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash')
      .mockRejectedValueOnce(new Error('some_error'))

    const sutPromise = sut.add(mockAccount())
    await expect(sutPromise).rejects.toThrow(new Error('some_error'))
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub, hasherSpy } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = mockAccount()
    await sut.add(accountData)
    expect(addAccountRepositoryStub.add).toHaveBeenCalledWith({ ...accountData, password: hasherSpy.digest })
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
    const fakeAccount = mockAccount()
    const account = await sut.add(fakeAccount)
    expect(account).toEqual(fakeAccount)
  })

  test('Should return null if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const fakeAccount = mockAccount()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(fakeAccount)
    const account = await sut.add(fakeAccount)
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
