import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import MockDate from 'mockdate'
import { LoadAnswersBySurveySpy, SaveSurveyResultSpy } from '@/presentation/test'
import { faker } from '@faker-js/faker'

function mockRequest (answer?: string): SaveSurveyResultController.Request {
  return {
    answer: answer || faker.random.word(),
    surveyId: faker.datatype.uuid(),
    accountId: faker.datatype.uuid()
  }
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveySpy: LoadAnswersBySurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

function makeSut (): SutTypes {
  const loadAnswersBySurveySpy = new LoadAnswersBySurveySpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(
    loadAnswersBySurveySpy,
    saveSurveyResultSpy
  )

  return {
    sut,
    loadAnswersBySurveySpy,
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
  test('Should call LoadAnswersBySurveySpy with correct survey id', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()

    const fakeRequest = mockRequest(loadAnswersBySurveySpy.result[0])
    await sut.handle(fakeRequest)

    expect(loadAnswersBySurveySpy.surveyId).toBe(fakeRequest.surveyId)
  })

  test('Should return 403 if LoadAnswersBySurveySpy returns an empty array', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    loadAnswersBySurveySpy.result = []
    const fakeRequest = mockRequest()
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadAnswersBySurveySpy throws', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers').mockRejectedValueOnce(errorMock)
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const fakeRequest = mockRequest()
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const fakeRequest = mockRequest(loadAnswersBySurveySpy.result[0])
    await sut.handle(fakeRequest)

    expect(saveSurveyResultSpy.params).toEqual({
      ...fakeRequest,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(errorMock)
    const request = mockRequest(loadAnswersBySurveySpy.result[0])
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 200 with SaveSurveyResultModel on success', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const request = mockRequest(loadAnswersBySurveySpy.result[0])
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.result))
  })
})
