import { HttpRequest, Validation, AddSurvey } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { mockAddSurvey, mockValidation } from '@/presentation/test'
function mockRequest (): HttpRequest {
  return {
    body: {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    }
  }
}

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

function makeSut (): SutTypes {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub
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
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(validationStub.validate).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return badRequest if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(errorMock)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(errorMock))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(addSurveyStub.add).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return serverError if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(errorMock)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
