import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { ValidationSpy } from '@/presentation/test'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  sut: ValidationComposite
  validationSpies: ValidationSpy[]
}
function makeSut (): SutTypes {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidationComposite(validationSpies)
  return {
    sut,
    validationSpies
  }
}
describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies: [validationSpy] } = makeSut()

    const errorMock = new MissingParamError('field')
    validationSpy.error = errorMock

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(errorMock)
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut()

    const expectedError = new MissingParamError('field')
    const nonExpctedErrorMock = new InvalidParamError('other_field')
    validationSpies[0].error = expectedError
    validationSpies[1].error = nonExpctedErrorMock

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(expectedError)
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
