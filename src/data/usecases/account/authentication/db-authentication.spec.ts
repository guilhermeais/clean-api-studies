import { EncrypterSpy, HashComparerSpy, LoadAccountByEmailRepositorySpy, UpdateAccessTokenRepositorySpy } from '@/data/test'
import { mockAuthentication } from '@/domain/test'
import { DbAuthentication } from './db-authentication'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

function makeSut (): SutTypes {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}
describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const fakeAuthentication = mockAuthentication()
    await sut.auth(fakeAuthentication)

    expect(loadAccountByEmailRepositorySpy.email).toBe(fakeAuthentication.email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result = null
    const authenticationModel = await sut.auth(mockAuthentication())

    expect(authenticationModel).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationMock = mockAuthentication()
    await sut.auth(authenticationMock)

    expect(hashComparerSpy.plaintext).toBe(authenticationMock.password)
    expect(hashComparerSpy.digest).toBe(loadAccountByEmailRepositorySpy.result.password)
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
    const authenticationModel = await sut.auth(mockAuthentication())

    expect(authenticationModel).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationMock = mockAuthentication()
    await sut.auth(authenticationMock)

    expect(encrypterSpy.plaintext).toBe(loadAccountByEmailRepositorySpy.result.id)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(encrypterSpy, 'encrypt').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })

  test('Should return an authentication model on success', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()

    const { accessToken, name } = await sut.auth(mockAuthentication())

    expect(accessToken).toBe(encrypterSpy.ciphertext)
    expect(name).toBe(loadAccountByEmailRepositorySpy.result.name)
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationMock = mockAuthentication()
    await sut.auth(authenticationMock)

    expect(updateAccessTokenRepositorySpy.id).toBe(loadAccountByEmailRepositorySpy.result.id)
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext)
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    const mockError = new Error('some_error')
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockRejectedValueOnce(mockError)
    const authPromise = sut.auth(mockAuthentication())

    await expect(authPromise).rejects.toThrow(mockError)
  })
})
