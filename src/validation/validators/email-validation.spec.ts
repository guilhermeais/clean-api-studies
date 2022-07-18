import { AccountModel } from '@/presentation/controllers/login/signup/signup-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  return emailValidatorStub
}

function makeFakeRequest (): HttpRequest {
  const account = makeFakeAccount()
  return {
    body: {
      ...account,
      passwordConfirmation: account.password
    }
  }
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }
}

function makeSut (): SutTypes {
  const emailValidatorStub = makeEmailValidator()
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
    const httpRequest = makeFakeRequest()
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
    const httpRequest = makeFakeRequest()
    const validationResult = sut.validate(httpRequest.body)
    expect(validationResult).toEqual(new InvalidParamError('email'))
  })
})
