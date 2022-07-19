import { HttpRequest, AccountModel, LoadAccountByToken } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

function makeFakeRequest (): HttpRequest {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'some_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_hashed_password'
  }
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

function makeLoadAccountByToken (): LoadAccountByToken {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByTokenStub()
}

function makeSut (role?: string): SutTypes {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {}
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenStub.load).toHaveBeenCalledWith('any_token', role)
  })
  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpRequest: HttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accountId: makeFakeAccount().id }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(errorMock)
    const httpRequest: HttpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(errorMock))
  })
})
