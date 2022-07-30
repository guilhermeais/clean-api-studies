import { mockSurveyResult } from '@/domain/test/mock-survey-result'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResultParams, SurveyResultModel } from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export function mockSaveSurveyResultRepository (): SaveSurveyResultRepository {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
