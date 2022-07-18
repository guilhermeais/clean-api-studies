import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../usecases/decorators/log-controller-decorator-factory'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-survey/load-surveys-controller'
import { makeDbLoadSurvey } from '../../../usecases/survey/load-surveys/db-load-surveys-factory'

export function makeLoadSurveysController (): Controller {
  return makeLogControllerDecorator(new LoadSurveysController(makeDbLoadSurvey()))
}
