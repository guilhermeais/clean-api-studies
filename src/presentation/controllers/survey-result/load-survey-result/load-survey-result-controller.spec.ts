import { LoadSurveyResultController } from './load-survey-result-controller'
import { CheckSurveyByIdSpy, LoadSurveyResultSpy } from '@/presentation/test'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'

function mockRequest (): LoadSurveyResultController.Request {
  return {
    accountId: faker.datatype.uuid(),
    surveyId: faker.datatype.uuid()
  }
}

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdSpy: CheckSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

function makeSut (): SutTypes {
  const checkSurveyByIdSpy = new CheckSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(checkSurveyByIdSpy, loadSurveyResultSpy)

  return {
    sut,
    checkSurveyByIdSpy,
    loadSurveyResultSpy
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call CheckSurveyById with correct surveyId', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)

    expect(checkSurveyByIdSpy.surveyId).toBe(request.surveyId)
  })

  test('Should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    checkSurveyByIdSpy.result = false
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(checkSurveyByIdSpy, 'checkById').mockRejectedValueOnce(mockedError)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(mockedError))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)

    expect(loadSurveyResultSpy.surveyId).toBe(request.surveyId)
    expect(loadSurveyResultSpy.accountId).toBe(request.accountId)
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(mockedError)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(mockedError))
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.surveyResult))
  })
})
