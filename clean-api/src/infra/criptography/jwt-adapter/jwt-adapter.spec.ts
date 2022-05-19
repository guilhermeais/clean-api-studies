import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => await Promise.resolve('any_token')
}))
describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    jest.spyOn(jwt, 'sign')
    const sut = new JwtAdapter('secret')
    await sut.encrypt('any_id')
    expect(jwt.sign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should returns a token on sign success', async () => {
    const sut = new JwtAdapter('secret')
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
})
