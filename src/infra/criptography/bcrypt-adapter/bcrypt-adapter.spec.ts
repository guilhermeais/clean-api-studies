import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const MOCKED_HASH_VALUE = 'hashed_value_16545465'
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve(MOCKED_HASH_VALUE)
  },

  async compare (): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const salt = 12
function makeSut (): BcryptAdapter {
  return new BcryptAdapter(salt)
}
describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'hash')
      const hash = await sut.hash('any_value')
      expect(hash).toBe(MOCKED_HASH_VALUE)
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(function hash (): any {
        return Promise.reject(new Error('some_error'))
      })
      const sutPromise = sut.hash('any_value')
      await expect(sutPromise).rejects.toThrow(new Error('some_error'))
    })
  })
  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(bcrypt.compare).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never)
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSut()

      jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(new Error('some_error') as never)
      const sutPromise = sut.compare('any_value', 'any_hash')
      await expect(sutPromise).rejects.toThrow(new Error('some_error'))
    })
  })
})
