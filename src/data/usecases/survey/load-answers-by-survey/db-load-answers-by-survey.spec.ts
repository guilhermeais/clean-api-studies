import { LoadAnswersBySurveyRepositorySpy } from '@/data/test'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
}

function makeSut (): SutTypes {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)

  return {
    sut,
    loadAnswersBySurveyRepositorySpy
  }
}

describe('DbLoadAnswersBySurvey', () => {
  let surveyId: string
  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    await sut.loadAnswers(surveyId)

    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId)
  })

  test('Should return a list of answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual(loadAnswersBySurveyRepositorySpy.result)
  })

  test('Should return an empty list if LoadAnswersBySurveyRepository returns an empty list', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    loadAnswersBySurveyRepositorySpy.result = []
    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual([])
  })

  test('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers').mockRejectedValue(errorMock)

    const sutPromise = sut.loadAnswers(surveyId)
    await expect(sutPromise).rejects.toThrow(errorMock)
  })
})
