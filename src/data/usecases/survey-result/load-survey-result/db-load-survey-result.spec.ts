import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockSurveyResultEmpty } from '@/domain/test'
import { LoadSurveyByIdRepository } from './db-load-survey-result-protocols'
import { mockLoadSurveyByIdRepository, LoadSurveyResultRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'
type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

function makeSut (): SutTypes {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()

    await sut.load('any_survey_id')

    expect(loadSurveyResultRepositorySpy.surveyId).toBe('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockRejectedValueOnce(mockedError)

    const sutPromise = sut.load('any_survey_id')
    await expect(sutPromise).rejects.toThrow(mockedError)
  })

  test('Should return SurveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load('any_survey_id')

    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResult)
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositoryStub } = makeSut()
    loadSurveyResultRepositorySpy.surveyResult = null
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load('any_survey_id')

    expect(loadSurveyByIdRepositoryStub.loadById).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return an SurveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockResolvedValueOnce(null)
    const surveyResult = await sut.load('any_survey_id')

    expect(surveyResult).toEqual(mockSurveyResultEmpty())
  })
})
