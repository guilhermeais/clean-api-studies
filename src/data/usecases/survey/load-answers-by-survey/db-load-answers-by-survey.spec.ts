import { LoadSurveyByIdRepositorySpy } from '@/data/test'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

function makeSut (): SutTypes {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyByIdRepositorySpy
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
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.loadAnswers(surveyId)

    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('Should return a list of answers on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual(loadSurveyByIdRepositorySpy.result.answers.map(a => a.answer))
  })

  test('Should return an empty list if LoadSurveyByIdRepo returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.result = null
    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual([])
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockRejectedValue(errorMock)

    const sutPromise = sut.loadAnswers(surveyId)
    await expect(sutPromise).rejects.toThrow(errorMock)
  })
})
