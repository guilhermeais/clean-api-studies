import { LoadSurveysRepositorySpy } from '@/data/test'
import { faker } from '@faker-js/faker'
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
  test('Should call LoadSurveysRepository with correct accountId', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const accountId = faker.datatype.uuid()
    await sut.load(accountId)

    expect(loadSurveysRepositorySpy.accountId).toBe(accountId)
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const surveys = await sut.load(faker.datatype.uuid())

    expect(surveys).toEqual(loadSurveysRepositorySpy.surveys)
  })

  test('Should throw if LoadSurveyRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockRejectedValue(errorMock)

    const sutPromise = sut.load(faker.datatype.uuid())
    await expect(sutPromise).rejects.toThrow(errorMock)
  })
})
