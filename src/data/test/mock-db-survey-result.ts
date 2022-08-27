import { mockSurveyResult } from '@/domain/test'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'
import { LoadSurveyResultRepository, SaveSurveyResultParams, SurveyResultModel } from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams: SaveSurveyResultParams
  async save (data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data
    return await Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyResult = mockSurveyResult()
  surveyId: string
  accountId: string

  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResult)
  }
}
