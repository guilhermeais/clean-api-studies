import { Validation } from '../protocols'

export function mockValidation (): Validation {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new ValidationStub()
}
