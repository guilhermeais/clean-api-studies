import { DbSaveSurveyResult } from './db-save-survey-result'

import MockDate from 'mockdate'
import { LoadSurveyResultRepositorySpy, SaveSurveyResultRepositorySpy } from '@/data/test'
import { mockSaveSurveyResultParams } from '@/domain/test/mock-survey-result'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

function makeSut (): SutTypes {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy, loadSurveyResultRepositorySpy)
  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const saveSurveyData = mockSaveSurveyResultParams()
    await sut.save(saveSurveyData)

    expect(saveSurveyResultRepositorySpy.params).toEqual(saveSurveyData)
  })

  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const saveSurveyData = mockSaveSurveyResultParams()
    await sut.save(saveSurveyData)

    expect(loadSurveyResultRepositorySpy.surveyId).toBe(saveSurveyData.surveyId)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockRejectedValueOnce(mockedError)

    const sutPromise = sut.save(mockSaveSurveyResultParams())
    await expect(sutPromise).rejects.toThrow(mockedError)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockRejectedValueOnce(mockedError)

    const sutPromise = sut.save(mockSaveSurveyResultParams())
    await expect(sutPromise).rejects.toThrow(mockedError)
  })

  test('should return a SurveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const saveSurveyData = mockSaveSurveyResultParams()
    const surveyResult = await sut.save(saveSurveyData)

    expect(loadSurveyResultRepositorySpy.result).toEqual(surveyResult)
  })
})
