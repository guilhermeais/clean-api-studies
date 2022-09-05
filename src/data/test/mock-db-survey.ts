import { mockSurvey, mockSurveys } from '@/domain/test'
import { CheckSurveyByIdRepository } from '../protocols/db/survey'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyRepository.Params
  async add (data: AddSurveyRepository.Params): Promise<void> {
    this.addSurveyParams = data
    return await Promise.resolve()
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result = mockSurvey()
  id: string
  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }
}
export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  result = true
  id: string
  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveys = mockSurveys()
  accountId: string
  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return await Promise.resolve(this.surveys)
  }
}
