import { EncrypterSpy, HashComparerSpy, mockLoadAccountEmailByRepository, mockUpdateAccessTokenRepository } from '@/data/test'
import { mockAuthentication } from '@/domain/test'
import { DbAuthentication } from './db-authentication'

import {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = mockLoadAccountEmailByRepository()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositoryStub
  }
}
describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(mockAuthentication())

    expect(loadAccountByEmailRepositoryStub.loadByEmail).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(mockAuthentication())

    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy } = makeSut()
    const authenticationMock = mockAuthentication()
    await sut.auth(authenticationMock)

    expect(hashComparerSpy.plaintext).toBe(authenticationMock.password)
    expect(hashComparerSpy.digest).toBe('any_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(hashComparerSpy, 'compare').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValid = false
    const accessToken = await sut.auth(mockAuthentication())

    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy } = makeSut()
    const authenticationMock = mockAuthentication()
    await sut.auth(authenticationMock)

    expect(encrypterSpy.plaintext).toBe('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(encrypterSpy, 'encrypt').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })

  test('Should return a valid access token', async () => {
    const { sut, encrypterSpy } = makeSut()

    const accessToken = await sut.auth(mockAuthentication())

    expect(accessToken).toBe(encrypterSpy.ciphertext)
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub, encrypterSpy } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const authenticationMock = mockAuthentication()
    await sut.auth(authenticationMock)

    expect(updateAccessTokenRepositoryStub.updateAccessToken).toHaveBeenCalledWith('any_id', encrypterSpy.ciphertext)
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })
})
