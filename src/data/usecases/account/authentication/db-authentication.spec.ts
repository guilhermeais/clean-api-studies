import { mockEncrypter, mockHashComparer, mockLoadAccountEmailByRepository, mockUpdateAccessTokenRepository } from '@/data/test'
import { mockAuthentication } from '@/domain/test'
import { DbAuthentication } from './db-authentication'

import {
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositoryStub = mockLoadAccountEmailByRepository()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
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
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare')
    const authenticationMock = mockAuthentication()
    await sut.auth(authenticationMock)

    expect(hashComparerStub.compare).toHaveBeenCalledWith(authenticationMock.password, 'any_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const accessToken = await sut.auth(mockAuthentication())

    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
    const authenticationMock = mockAuthentication()
    await sut.auth(authenticationMock)

    expect(encrypterStub.encrypt).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })

  test('Should return a valid access token', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(mockAuthentication())

    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const authenticationMock = mockAuthentication()
    await sut.auth(authenticationMock)

    expect(updateAccessTokenRepositoryStub.updateAccessToken).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })
})
