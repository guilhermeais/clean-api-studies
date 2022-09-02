import { DbAddAccount } from './db-add-account'
import { mockAccount, mockAddAccountParams } from '@/domain/test'
import { HasherSpy, AddAccountRepositorySpy, LoadAccountByEmailRepositorySpy } from '@/data/test'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.result = null
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
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
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add')
    const accountData = mockAccount()
    await sut.add(accountData)
    expect(addAccountRepositorySpy.addAccountParams).toEqual({ ...accountData, password: hasherSpy.digest })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add')
      .mockRejectedValueOnce(new Error('some_error'))

    const sutPromise = sut.add(mockAccount())
    await expect(sutPromise).rejects.toThrow(new Error('some_error'))
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const fakeAccount = mockAccount()
    const isValid = await sut.add(fakeAccount)
    expect(isValid).toBe(true)
  })

  test('Should return false if addAccountRepositorySpy returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.isValid = false
    const fakeAccount = mockAccount()
    const isValid = await sut.add(fakeAccount)
    expect(isValid).toBe(false)
  })

  test('Should return false if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result = {
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
      password: faker.internet.password()
    }
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()

    const fakeAccount = mockAccount()
    await sut.add(fakeAccount)

    expect(loadAccountByEmailRepositorySpy.email).toBe(fakeAccount.email)
  })
})
