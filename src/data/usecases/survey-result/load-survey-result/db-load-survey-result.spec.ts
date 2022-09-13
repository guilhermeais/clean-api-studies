import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockEmptySurveyResult } from '@/domain/test'
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

function makeSut (): SutTypes {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  }
}

let surveyId: string
let accountId: string
describe('DbLoadSurveyResult UseCase', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid()
    accountId = faker.datatype.uuid()
  })
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()

    await sut.load(surveyId, accountId)

    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockRejectedValueOnce(mockedError)

    const sutPromise = sut.load(surveyId, accountId)
    await expect(sutPromise).rejects.toThrow(mockedError)
  })

  test('Should return SurveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)

    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result)
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.result = null
    await sut.load(surveyId, accountId)

    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('Should return an SurveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.result = null
    const surveyResult = await sut.load(surveyId, accountId)

    expect(surveyResult).toEqual(mockEmptySurveyResult(loadSurveyByIdRepositorySpy.result))
  })
})
