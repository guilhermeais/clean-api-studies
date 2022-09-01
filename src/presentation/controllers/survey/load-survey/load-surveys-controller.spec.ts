import { LoadSurveysController } from './load-surveys-controller'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { LoadSurveysSpy } from '@/presentation/test'
import { faker } from '@faker-js/faker'

function mockRequest (): LoadSurveysController.Request {
  return {
    accountId: faker.datatype.uuid()
  }
}

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}

function makeSut (): SutTypes {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)

  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys with correct accountId', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)

    expect(loadSurveysSpy.accountId).toEqual(request.accountId)
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveys))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.surveys = []
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveysSpy, 'load').mockRejectedValueOnce(errorMock)
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(errorMock))
  })
})
