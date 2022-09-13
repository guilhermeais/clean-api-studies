import { CheckSurveyByIdRepositorySpy } from '@/data/test'
import { faker } from '@faker-js/faker'
import { DbCheckSurveyById } from './db-check-survey-by-id'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

function makeSut (): SutTypes {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)

  return {
    sut,
    checkSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyById', () => {
  let surveyId: string
  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })
  test('Should call CheckSurveyByIdRepository', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    await sut.checkById(surveyId)

    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()
    const exists = await sut.checkById(surveyId)

    expect(exists).toBe(true)
  })

  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.result = false
    const exists = await sut.checkById(surveyId)

    expect(exists).toBe(false)
  })

  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockRejectedValue(errorMock)

    const sutPromise = sut.checkById('any_id')
    await expect(sutPromise).rejects.toThrow(errorMock)
  })
})
