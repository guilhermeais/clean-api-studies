import { AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'
import { mockAddSurveyRepository } from '@/data/test'
import { mockAddSurveyParams } from '@/domain/test'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

function makeSut (): SutTypes {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = mockAddSurveyParams()
    await sut.add(surveyData)

    expect(addSurveyRepositoryStub.add).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(mockedError)

    const sutPromise = sut.add(mockAddSurveyParams())
    await expect(sutPromise).rejects.toThrow(mockedError)
  })
})
