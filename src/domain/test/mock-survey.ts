import { SurveyModel } from '../models/survey'
import { AddSurveyParams } from '../usecases/survey/add-survey'

export function mockAddSurveyParams (): AddSurveyParams {
  return {
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

export function mockSurvey (): SurveyModel {
  return {
    id: 'any_id',
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

export function mockSurveys (): SurveyModel[] {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          answer: 'other_answer'
        }
      ],
      date: new Date()
    }
  ]
}
