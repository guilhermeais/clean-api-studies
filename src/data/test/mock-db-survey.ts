import { mockSurvey, mockSurveys } from '@/domain/test'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository'
import { AddSurveyParams } from '../usecases/survey/add-survey/db-add-survey-protocols'
import { SurveyModel } from '../usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'

export function mockAddSurveyRepository (): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export function mockLoadSurveyByIdRepository (): LoadSurveyByIdRepository {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export function mockLoadSurveysRepository (): LoadSurveysRepository {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveysRepositoryStub()
}
