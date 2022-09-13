import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/usecases/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/load-survey-result/db-load-survey-result'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { makeDbCheckSurveyById } from '@/main/factories/usecases/survey/check-survey-by-id/db-check-survey-by-id-factory'

export function makeLoadSurveyResultController (): Controller {
  return makeLogControllerDecorator(new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult()))
}
