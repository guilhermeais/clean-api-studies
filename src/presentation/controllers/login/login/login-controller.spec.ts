import LoginController from './login-controller'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, Validation } from './login-controller-protocols'
import { AuthenticationSpy, mockValidation } from '@/presentation/test'

function mockRequest (): HttpRequest {
  return {
    body: {
      email: 'invalid_email',
      password: 'any_password'

    }
  }
}

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationStub: Validation
}

function makeSut (): SutTypes {
  const authenticationSpy = new AuthenticationSpy()
  const validationStub = mockValidation()
  const sut = new LoginController(validationStub, authenticationSpy)
  return {
    sut,
    authenticationSpy,
    validationStub
  }
}
describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    const fakeAuth = { email: httpRequest.body.email, password: httpRequest.body.password }
    expect(authenticationSpy.authenticationParams).toEqual(fakeAuth)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    authenticationSpy.ciphertext = null
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(errorMock)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: authenticationSpy.ciphertext }))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationStub.validate).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const errorMock = new MissingParamError('any_field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(errorMock)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(errorMock))
  })
})
