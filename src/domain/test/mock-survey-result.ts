import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'
import { mockSurvey } from './mock-survey'

export function mockSurveyResult (): SurveyResultModel {
  return {
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
        count: 1,
        percent: 50
      },
      {
        answer: 'other_answer',
        count: 1,
        percent: 50
      }
    ],
    date: new Date()
  }
}

export function mockSurveyResultEmpty (): SurveyResultModel {
  const survey = mockSurvey()
  return {
    ...survey,
    surveyId: survey.id,
    question: survey.question,
    date: survey.date,
    answers: survey.answers.map(answer => ({
      ...answer,
      count: 0,
      percent: 0
    }))
  }
}

export function mockSaveSurveyResultParams (): SaveSurveyResultParams {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}
