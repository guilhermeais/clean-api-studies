import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => await Promise.resolve('any_token')
}))

function makeSut (): JwtAdapter {
  return new JwtAdapter('secret')
}
describe('JWT Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      jest.spyOn(jwt, 'sign')
      const sut = makeSut()
      await sut.encrypt('any_id')
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should returns a token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockRejectedValueOnce(new Error('some_error') as never)
      const sutPromise = sut.encrypt('any_id')
      await expect(sutPromise).rejects.toThrow(new Error('some_error'))
    })
  })
})
