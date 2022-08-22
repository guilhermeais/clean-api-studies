import { LoadSurveyResultController } from './load-survey-result-controller'
import {
  HttpRequest
} from './load-survey-result-controller-protocols'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@/presentation/test'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'

function mockRequest (): HttpRequest {
  return {
    params: {
      surveyId: 'any_id'
    }
  }
}

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

function makeSut (): SutTypes {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(loadSurveyByIdSpy, loadSurveyResultSpy)

  return {
    sut,
    loadSurveyByIdSpy,
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
  test('Should call LoadSurveyById with correct surveyId', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    await sut.handle(mockRequest())

    expect(loadSurveyByIdSpy.surveyId).toBe('any_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    loadSurveyByIdSpy.survey = null
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockRejectedValueOnce(mockedError)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(mockedError))
  })

  test('Should call LoadSurveyResult with correct surveyId', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    await sut.handle(mockRequest())

    expect(loadSurveyResultSpy.surveyId).toBe('any_id')
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
