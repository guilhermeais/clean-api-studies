import LoginController from './login-controller'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from './login-controller-protocols'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'

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
  validationSpy: ValidationSpy
}

function makeSut (): SutTypes {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(validationSpy, authenticationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy
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
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const errorMock = new MissingParamError('any_field')
    validationSpy.error = errorMock
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(errorMock))
  })
})
