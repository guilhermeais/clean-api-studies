import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
function makeFakeSurveyData (): AddSurveyModel {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
}

describe('DbAddSurvey Usecase', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (data: AddSurveyModel): Promise<void> {
        return await Promise.resolve()
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    jest.spyOn(addSurveyRepositoryStub, 'add')
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)

    expect(addSurveyRepositoryStub.add).toHaveBeenCalledWith(surveyData)
  })
})
