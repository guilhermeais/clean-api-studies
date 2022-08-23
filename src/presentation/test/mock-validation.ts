import { Validation } from '../protocols'

export class ValidationSpy implements Validation {
  input: any
  error: Error | undefined = undefined
  validate (input: any): Error | undefined {
    this.input = input
    return this.error
  }
}
