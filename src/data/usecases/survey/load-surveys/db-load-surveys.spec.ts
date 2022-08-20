import { LoadSurveysRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

function makeSut (): SutTypes {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)

  return {
    sut,
    loadSurveysRepositorySpy
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
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll')
    await sut.load()

    expect(loadSurveysRepositorySpy.loadAll).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const surveys = await sut.load()

    expect(surveys).toEqual(loadSurveysRepositorySpy.surveys)
  })

  test('Should throw if LoadSurveyRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockRejectedValue(errorMock)

    const sutPromise = sut.load()
    await expect(sutPromise).rejects.toThrow(errorMock)
  })
})
