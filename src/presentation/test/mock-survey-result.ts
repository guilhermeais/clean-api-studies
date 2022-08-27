import { SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import { mockSurveyResult } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  saveSurveyResultParams: SaveSurveyResultParams
  surveyResult = mockSurveyResult()
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultParams = data
    return await Promise.resolve(this.surveyResult)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  accountId: string
  surveyResult = mockSurveyResult()
  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResult)
  }
}
