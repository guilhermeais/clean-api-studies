import { MissingParamError } from '../../errors'
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
  validationStub: Validation
}
function makeSut (): SutTypes {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}
describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()

    const errorMock = new MissingParamError('field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(errorMock)

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(error)
  })
})
