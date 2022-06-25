import { Controller } from '../../../../presentation/protocols'
import LoginController from '../../../../presentation/controllers/login/login-controller'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../usecases/decorators/log-controller-decorator-factory'

export function makeLoginController (): Controller {
  return makeLogControllerDecorator(new LoginController(makeLoginValidation(), makeDbAuthentication()))
}
