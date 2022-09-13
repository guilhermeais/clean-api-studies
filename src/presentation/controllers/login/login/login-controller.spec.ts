import { LoginController } from './login-controller'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'
import { faker } from '@faker-js/faker'

function mockRequest (): LoginController.Request {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
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
    const request = mockRequest()
    await sut.handle(request)
    const fakeAuth = { email: request.email, password: request.password }
    expect(authenticationSpy.authenticationParams).toEqual(fakeAuth)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    authenticationSpy.authenticationModel = null
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(errorMock)
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const errorMock = new MissingParamError('any_field')
    validationSpy.error = errorMock
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(errorMock))
  })
})
