import { Validation } from '@/presentation/protocols'

export function mockValidation (): Validation {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}
