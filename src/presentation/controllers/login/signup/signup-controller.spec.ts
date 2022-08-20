import { mockAccount } from '@/domain/test'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockAuthentication, mockValidation, AddAccountSpy } from '@/presentation/test'
import { SignUpController } from './signup-controller'
import {
  HttpRequest,
  Validation,
  Authentication
} from './signup-controller-protocols'

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationStub: Validation
  authenticationStub: Authentication
}

function mockRequest (): HttpRequest {
  const account = mockAccount()
  return {
    body: {
      ...account,
      passwordConfirmation: account.password
    }
  }
}

function makeSut (): SutTypes {
  const addAccountSpy = new AddAccountSpy()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(
    addAccountSpy,
    validationStub,
    authenticationStub
  )
  return {
    sut,
    addAccountSpy,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addAccountSpy.addAccountParams).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(errorMock)
    })

    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toStrictEqual(
      new ServerError(errorMock.stack || '')
    )
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.account = null
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
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

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authenticationStub.auth).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(errorMock)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(errorMock))
  })
})
