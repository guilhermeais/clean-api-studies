import { Controller } from '@/presentation/protocols'
import LoginController from '@/presentation/controllers/login/login/login-controller'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/usecases/decorators/log-controller-decorator-factory'

export function makeLoginController (): Controller {
  return makeLogControllerDecorator(new LoginController(makeLoginValidation(), makeDbAuthentication()))
}
