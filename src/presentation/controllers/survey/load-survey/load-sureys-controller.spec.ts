import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
function makeFakeSurveys (): SurveyModel[] {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          answer: 'other_answer'
        }
      ],
      date: new Date()
    }
  ]
}

function makeLoadSurveys (): LoadSurveys {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(makeFakeSurveys())
    }
  }
  return new LoadSurveysStub()
}
type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

function makeSut (): SutTypes {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})

    expect(loadSurveysStub.load).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(errorMock)
    const httpRequest = {}
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(errorMock))
  })
})
