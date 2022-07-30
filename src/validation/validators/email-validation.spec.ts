import { mockAccount } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { EmailValidator } from '../protocols/email-validator'
import { mockEmailValidator } from '../test'
import { EmailValidation } from './email-validation'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
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
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = mockRequest()
    sut.validate(httpRequest.body)
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const errorMock = new Error('some_error ')
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(
        () => { throw errorMock }
      )

    expect(sut.validate).toThrow()
  })

  test('Should return and error if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = mockRequest()
    const validationResult = sut.validate(httpRequest.body)
    expect(validationResult).toEqual(new InvalidParamError('email'))
  })
})
