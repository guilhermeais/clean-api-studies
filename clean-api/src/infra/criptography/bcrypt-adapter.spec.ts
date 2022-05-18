import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const MOCKED_HASH_VALUE = 'hashed_value_16545465'
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve(MOCKED_HASH_VALUE)
  }
}))

const salt = 12
function makeSut (): BcryptAdapter {
  return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash')
    const hash = await sut.hash('any_value')
    expect(hash).toBe(MOCKED_HASH_VALUE)
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(function hash (): any {
      return Promise.reject(new Error('some_error'))
    })
    const sutPromise = sut.hash('any_value')
    await expect(sutPromise).rejects.toThrow(new Error('some_error'))
  })
})
