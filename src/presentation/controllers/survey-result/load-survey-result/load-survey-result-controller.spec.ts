import { mockLoadSurveyById } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest } from './load-survey-result-controller-protocols'

function mockRequest (): HttpRequest {
  return {
    params: {
      surveyId: 'any_survey_id'
    }
  }
}

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct surveyId', async () => {
    const loadSurveyByIdStub = mockLoadSurveyById()
    const sut = new LoadSurveyResultController(loadSurveyByIdStub)
    jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())

    expect(loadSurveyByIdStub.loadById).toHaveBeenCalledWith('any_survey_id')
  })
})
