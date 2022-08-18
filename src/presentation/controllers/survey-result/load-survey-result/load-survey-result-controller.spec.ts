import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest, LoadSurveyById } from './load-survey-result-controller-protocols'
import { mockLoadSurveyById } from '@/presentation/test'

function mockRequest (): HttpRequest {
  return {
    params: {
      surveyId: 'any_survey_id'
    }
  }
}

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

function makeSut (): SutTypes {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct surveyId', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())

    expect(loadSurveyByIdStub.loadById).toHaveBeenCalledWith('any_survey_id')
  })
})
