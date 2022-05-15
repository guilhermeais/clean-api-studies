import { InvalidParamError, MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}
interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}
function makeSut (): SutTypes {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}
describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs: [validationStub] } = makeSut()

    const errorMock = new MissingParamError('field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(errorMock)

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(error)
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()

    const expectedError = new MissingParamError('field')
    const nonExpctedErrorMock = new InvalidParamError('other_field')
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(expectedError)
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(nonExpctedErrorMock)

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(expectedError)
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
