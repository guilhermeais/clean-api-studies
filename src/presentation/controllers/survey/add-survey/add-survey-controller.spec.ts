import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../../helpers/http/http-helper'
function makeFakeRequest (): HttpRequest {
  return {
    body: {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ]
    }
  }
}

function makeValition (): Validation {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

function makeSut (): SutTypes {
  const validationStub = makeValition()
  const sut = new AddSurveyController(validationStub)

  return {
    sut,
    validationStub
  }
}
describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(validationStub.validate).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return badRequest if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(errorMock)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(errorMock))
  })
})
