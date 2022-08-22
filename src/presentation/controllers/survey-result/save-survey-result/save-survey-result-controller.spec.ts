import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
  HttpRequest,
  LoadSurveyById
} from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'
import { mockLoadSurveyById, SaveSurveyResultSpy } from '@/presentation/test'

function mockRequest (): HttpRequest {
  return {
    body: {
      answer: 'any_answer'
    },
    params: {
      surveyId: 'any_survey_id'
    },
    accountId: 'any_account_id'
  }
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultSpy: SaveSurveyResultSpy
}

function makeSut (): SutTypes {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultSpy
  )

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultSpy
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyById with correct survey id', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById')
    const fakeRequest = mockRequest()
    await sut.handle(fakeRequest)

    expect(loadSurveyByIdStub.loadById).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const fakeRequest = mockRequest()
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(errorMock)
    const httpRequest = {}
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        answer: 'invalid_answer'
      },
      params: {
        surveyId: 'any_survey_id'
      }
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save')
    const fakeRequest = mockRequest()
    await sut.handle(fakeRequest)

    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(errorMock)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 200 with SaveSurveyResultModel on success', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResult))
  })
})
