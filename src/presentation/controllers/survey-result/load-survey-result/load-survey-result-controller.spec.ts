import { LoadSurveyResultController } from './load-survey-result-controller'
import {
  HttpRequest,
  LoadSurveyById
} from './load-survey-result-controller-protocols'
import { mockLoadSurveyById, LoadSurveyResultSpy } from '@/presentation/test'
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
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultSpy: LoadSurveyResultSpy
}

function makeSut (): SutTypes {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultSpy)

  return {
    sut,
    loadSurveyByIdStub,
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
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())

    expect(loadSurveyByIdStub.loadById).toHaveBeenCalledWith('any_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const mockedError = new Error('some_error')
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(mockedError)
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
