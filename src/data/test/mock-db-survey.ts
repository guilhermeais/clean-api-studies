import { mockSurvey, mockSurveys } from '@/domain/test'
import { faker } from '@faker-js/faker'
import { CheckSurveyByIdRepository, LoadSurveyByIdRepository, LoadAnswersBySurveyRepository } from '../protocols/db/survey'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../usecases/survey/load-answers-by-survey/db-load-answers-by-survey-protocols'

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

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  result = [
    faker.random.word(),
    faker.random.word()
  ]

  id: string
  async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
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
