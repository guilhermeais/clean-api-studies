import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../potocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'
function makeFakeSurveys (): SurveyModel[] {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          answer: 'other_answer'
        }
      ],
      date: new Date()
    }
  ]
}

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async loadAll (): Promise<SurveyModel[]> {
        return await Promise.resolve(makeFakeSurveys())
      }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()

    expect(loadSurveysRepositoryStub.loadAll).toHaveBeenCalled()
  })
})
