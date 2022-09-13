import { mockSurveyResult } from '@/domain/test'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'
import { LoadSurveyResultRepository } from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  params: SaveSurveyResultRepository.Params
  async save (data: SaveSurveyResultRepository.Params): Promise<void> {
    this.params = data
    return await Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  result = mockSurveyResult()
  surveyId: string
  accountId: string

  async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }
}
