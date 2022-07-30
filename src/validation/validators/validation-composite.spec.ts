import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'
import { mockValidation } from '../test'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}
function makeSut (): SutTypes {
  const validationStubs = [mockValidation(), mockValidation()]
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
