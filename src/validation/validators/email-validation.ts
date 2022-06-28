import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols'
import { Validation } from '../../presentation/protocols'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName])
    if (!isValidEmail) {
      return new InvalidParamError('email')
    }
  }
}
