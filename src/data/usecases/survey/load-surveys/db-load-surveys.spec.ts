import { mockLoadSurveysRepository } from '@/data/test'
import { mockSurveys } from '@/domain/test'
import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from './db-load-surveys-protocols'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

function makeSut (): SutTypes {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}
describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()

    expect(loadSurveysRepositoryStub.loadAll).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()

    expect(surveys).toEqual(mockSurveys())
  })

  test('Should throw if LoadSurveyRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValue(errorMock)

    const sutPromise = sut.load()
    await expect(sutPromise).rejects.toThrow(errorMock)
  })
})
