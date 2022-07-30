import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'

export function mockSurveyResult (): SurveyResultModel {
  return Object.assign({}, mockSaveSurveyResultParams(), { id: 'any_id' })
}

export function mockSaveSurveyResultParams (): SaveSurveyResultParams {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}
