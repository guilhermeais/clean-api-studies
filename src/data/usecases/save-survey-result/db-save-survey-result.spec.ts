import { DbSaveSurveyResult } from './db-save-survey-result'

import {
  SaveSurveyResultModel,
  SurveyResultModel,
  SaveSurveyResultRepository
} from './db-save-survey-result-protocols'

import MockDate from 'mockdate'

function makeFakeSurveyResult (): SurveyResultModel {
  return Object.assign({}, makeFakeSurveyResultData(), { id: 'any_id' })
}

function makeFakeSurveyResultData (): SaveSurveyResultModel {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}

function makeSaveSurveyRepository (): SaveSurveyResultRepository {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResult())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

function makeSut (): SutTypes {
  const saveSurveyResultRepositoryStub = makeSaveSurveyRepository()
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
    const saveSurveyData = makeFakeSurveyResultData()
    await sut.save(saveSurveyData)

    expect(saveSurveyResultRepositoryStub.save).toHaveBeenCalledWith(saveSurveyData)
  })
})
