import { DbSaveSurveyResult } from './db-save-survey-result'

import {

  SaveSurveyResultRepository
} from './db-save-survey-result-protocols'

import MockDate from 'mockdate'
import { mockSaveSurveyResultRepository } from '@/data/test'
import { mockSurveyResult, mockSaveSurveyResultParams } from '@/domain/test/mock-survey-result'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

function makeSut (): SutTypes {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
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

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(mockedError)

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
