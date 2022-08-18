import { DbSaveSurveyResult } from './db-save-survey-result'

import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from './db-save-survey-result-protocols'

import MockDate from 'mockdate'
import { mockSaveSurveyResultRepository } from '@/data/test'
import { mockSurveyResult, mockSaveSurveyResultParams, mockLoadSurveyResultRepository } from '@/domain/test/mock-survey-result'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

function makeSut (): SutTypes {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
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
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const saveSurveyData = mockSaveSurveyResultParams()
    await sut.save(saveSurveyData)

    expect(saveSurveyResultRepositoryStub.save).toHaveBeenCalledWith(saveSurveyData)
  })

  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const saveSurveyData = mockSaveSurveyResultParams()
    await sut.save(saveSurveyData)

    expect(loadSurveyResultRepositoryStub.loadBySurveyId).toHaveBeenCalledWith(saveSurveyData.surveyId)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(mockedError)

    const sutPromise = sut.save(mockSaveSurveyResultParams())
    await expect(sutPromise).rejects.toThrow(mockedError)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(mockedError)

    const sutPromise = sut.save(mockSaveSurveyResultParams())
    await expect(sutPromise).rejects.toThrow(mockedError)
  })

  test('should return a SurveyResult on success', async () => {
    const { sut } = makeSut()
    const saveSurveyData = mockSaveSurveyResultParams()
    const surveyResult = await sut.save(saveSurveyData)

    expect(surveyResult).toEqual(mockSurveyResult())
  })
})
