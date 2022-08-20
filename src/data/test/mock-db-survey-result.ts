import { mockSurveyResult } from '@/domain/test'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'
import { LoadSurveyResultRepository, SaveSurveyResultParams, SurveyResultModel } from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export function mockSaveSurveyResultRepository (): SaveSurveyResultRepository {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export function mockLoadSurveyResultRepository (): LoadSurveyResultRepository {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }

  return new LoadSurveyResultRepositoryStub()
}
