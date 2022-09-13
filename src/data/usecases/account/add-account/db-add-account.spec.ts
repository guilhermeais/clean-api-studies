import { DbAddAccount } from './db-add-account'
import { mockAddAccountParams } from '@/domain/test'
import { HasherSpy, AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy } from '@/data/test'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

function makeSut (): SutTypes {
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy)
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const account = mockAddAccountParams()
    await sut.add(account)
    expect(hasherSpy.plaintext).toBe(account.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash')
      .mockRejectedValueOnce(new Error('some_error'))

    const sutPromise = sut.add(mockAddAccountParams())
    await expect(sutPromise).rejects.toThrow(new Error('some_error'))
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add')
    const accountData = mockAddAccountParams()
    await sut.add(accountData)
    expect(addAccountRepositorySpy.addAccountParams).toEqual({ ...accountData, password: hasherSpy.digest })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add')
      .mockRejectedValueOnce(new Error('some_error'))

    const sutPromise = sut.add(mockAddAccountParams())
    await expect(sutPromise).rejects.toThrow(new Error('some_error'))
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const fakeAccount = mockAddAccountParams()
    const isValid = await sut.add(fakeAccount)
    expect(isValid).toBe(true)
  })

  test('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.isValid = false
    const fakeAccount = mockAddAccountParams()
    const isValid = await sut.add(fakeAccount)
    expect(isValid).toBe(false)
  })

  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })

  test('Should call checkAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()

    const fakeAccount = mockAddAccountParams()
    await sut.add(fakeAccount)

    expect(checkAccountByEmailRepositorySpy.email).toBe(fakeAccount.email)
  })
})
