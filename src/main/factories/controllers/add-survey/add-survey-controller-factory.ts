import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../usecases/decorators/log-controller-decorator-factory'
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeDbAddSurvey } from '../../usecases/add-survey/db-add-survey-factory'

export function makeAddSurveyController (): Controller {
  return makeLogControllerDecorator(new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey()))
}
