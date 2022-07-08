import { Decrypter } from '../../potocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

function makeDecrypter (): Decrypter {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }

  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

function makeSut (): SutTypes {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)

  return {
    sut,
    decrypterStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')

    expect(decrypterStub.decrypt).toHaveBeenCalledWith('any_token')
  })
})
