import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyResultRepository, mockSurveyResult } from '@/domain/test'
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

function makeSut (): SutTypes {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id')

    expect(loadSurveyResultRepositoryStub.loadBySurveyId).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(mockedError)

    const sutPromise = sut.load('any_survey_id')
    await expect(sutPromise).rejects.toThrow(mockedError)
  })

  test('Should return SurveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id')

    expect(surveyResult).toEqual(mockSurveyResult())
  })
})
