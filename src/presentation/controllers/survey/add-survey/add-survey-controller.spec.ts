import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { AddSurveySpy, ValidationSpy } from '@/presentation/test'
import { faker } from '@faker-js/faker'
function mockRequest (): AddSurveyController.Request {
  return {
    question: faker.random.word(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.random.word()
      }
    ]
  }
}

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

function makeSut (): SutTypes {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)

  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}
describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)

    expect(validationSpy.input).toEqual(request)
  })

  test('Should return badRequest if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    const errorMock = new Error('some_error')
    validationSpy.error = errorMock
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(errorMock))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)

    expect(addSurveySpy.addSurveyParams).toEqual({ ...request, date: new Date() })
  })

  test('Should return serverError if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(addSurveySpy, 'add').mockRejectedValueOnce(errorMock)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
