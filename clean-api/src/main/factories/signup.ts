import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/singup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export function makeSignUpController (): Controller {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const signupController = new SignUpController(emailValidator, dbAddAccount, makeSignUpValidation())
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logErrorRepository)
}
