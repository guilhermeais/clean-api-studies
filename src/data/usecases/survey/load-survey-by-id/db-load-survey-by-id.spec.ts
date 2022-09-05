import { LoadSurveyByIdRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

function makeSut (): SutTypes {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyByIdRepositorySpy
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
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const id = 'any_id'
    await sut.loadById(id)

    expect(loadSurveyByIdRepositorySpy.id).toBe(id)
  })

  test('Should return a list of Survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const survey = await sut.loadById('any_id')

    expect(survey).toEqual(loadSurveyByIdRepositorySpy.result)
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockRejectedValue(errorMock)

    const sutPromise = sut.loadById('any_id')
    await expect(sutPromise).rejects.toThrow(errorMock)
  })
})
