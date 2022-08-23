import { EmailValidator } from '../protocols'

export class EmailValidatorSpy implements EmailValidator {
  email: string
  isValidResult = true

  isValid (email: string): boolean {
    this.email = email
    return this.isValidResult
  }
}
