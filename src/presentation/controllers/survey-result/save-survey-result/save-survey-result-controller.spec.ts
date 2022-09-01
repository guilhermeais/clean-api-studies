import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
  SurveyModel
} from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'
import { LoadSurveyByIdSpy, SaveSurveyResultSpy } from '@/presentation/test'
import { faker } from '@faker-js/faker'

function mockRequest (survey?: SurveyModel): SaveSurveyResultController.Request {
  return {
    answer: survey?.answers[0]?.answer || faker.random.word(),
    surveyId: faker.datatype.uuid(),
    accountId: faker.datatype.uuid()
  }
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

function makeSut (): SutTypes {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  )

  return {
    sut,
    loadSurveyByIdSpy,
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
    const { sut, loadSurveyByIdSpy } = makeSut()

    const fakeRequest = mockRequest(loadSurveyByIdSpy.survey)
    await sut.handle(fakeRequest)

    expect(loadSurveyByIdSpy.surveyId).toBe(fakeRequest.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    loadSurveyByIdSpy.survey = null
    const fakeRequest = mockRequest()
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockRejectedValueOnce(errorMock)
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const fakeRequest = mockRequest(loadSurveyByIdSpy.survey)
    const invalidAnswer = loadSurveyByIdSpy.survey.answers[0].answer + faker.random.word()
    const httpResponse = await sut.handle({
      ...fakeRequest,
      answer: invalidAnswer
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    const fakeRequest = mockRequest(loadSurveyByIdSpy.survey)
    await sut.handle(fakeRequest)

    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      ...fakeRequest,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(errorMock)
    const request = mockRequest(loadSurveyByIdSpy.survey)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 200 with SaveSurveyResultModel on success', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    const request = mockRequest(loadSurveyByIdSpy.survey)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResult))
  })
})
