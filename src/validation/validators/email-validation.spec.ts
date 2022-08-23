import { mockAccount } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { EmailValidatorSpy } from '@/validation/test'
import { EmailValidation } from './email-validation'

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
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
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

describe('Email Validation', () => {
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = mockRequest()
    sut.validate(httpRequest.body)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const errorMock = new Error('some_error ')
    jest.spyOn(emailValidatorSpy, 'isValid')
      .mockImplementationOnce(
        () => { throw errorMock }
      )

    expect(sut.validate).toThrow()
  })

  test('Should return and error if EmailValidator returns false', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isValidResult = false
    const httpRequest = mockRequest()
    const validationResult = sut.validate(httpRequest.body)
    expect(validationResult).toEqual(new InvalidParamError('email'))
  })
})
