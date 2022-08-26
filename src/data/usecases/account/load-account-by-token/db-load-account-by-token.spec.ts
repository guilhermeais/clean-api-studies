import { DbLoadAccountByToken } from './db-load-account-by-token'
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/data/test'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

function makeSut (): SutTypes {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)

  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load('any_token', 'any_role')

    expect(decrypterSpy.cyphertext).toBe('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plaintext = null
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    await sut.load('any_token', 'any_role')

    expect(loadAccountByTokenRepositorySpy.token).toBe('any_token')
    expect(loadAccountByTokenRepositorySpy.role).toBe('any_role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    loadAccountByTokenRepositorySpy.account = null
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const account = await sut.load('any_token')
    expect(account).toEqual(loadAccountByTokenRepositorySpy.account)
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(decrypterSpy, 'decrypt').mockRejectedValueOnce(errorMock)

    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockRejectedValueOnce(errorMock)

    const sutPromise = sut.load('any_token', 'any_role')
    await expect(sutPromise).rejects.toThrow(errorMock)
  })
})
