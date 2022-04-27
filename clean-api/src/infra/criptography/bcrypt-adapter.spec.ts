import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const MOCKED_HASH_VALUE = 'hashed_value_16545465'
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve(MOCKED_HASH_VALUE)
  }

}))
describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    jest.spyOn(bcrypt, 'hash')
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe(MOCKED_HASH_VALUE)
  })
})
