import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'

function makeFakeSurvey (): SurveyModel {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
}

function makeLoadSurveysRepository (): LoadSurveyByIdRepository {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

function makeSut (): SutTypes {
  const loadSurveyByIdRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const id = 'any_id'
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById(id)

    expect(loadSurveyByIdRepositoryStub.loadById).toHaveBeenCalledWith(id)
  })

  test('Should return a list of Survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')

    expect(survey).toEqual(makeFakeSurvey())
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValue(errorMock)

    const sutPromise = sut.loadById('any_id')
    await expect(sutPromise).rejects.toThrow(errorMock)
  })
})
