import { faker } from '@faker-js/faker'
import { SurveyModel } from '../models/survey'
import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'
import { mockSurvey } from './mock-survey'

export function mockSurveyResult (): SurveyResultModel {
  return {
    surveyId: faker.datatype.uuid(),
    question: faker.lorem.sentence(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.lorem.sentence(),
        count: faker.datatype.number(),
        percent: faker.datatype.number({ precision: 0.01 }),
        isCurrentAccountAnswer: faker.datatype.boolean()
      },
      {
        answer: faker.lorem.sentence(),
        count: faker.datatype.number(),
        percent: faker.datatype.number({ precision: 0.01 }),
        isCurrentAccountAnswer: faker.datatype.boolean()

      }
    ],
    date: faker.date.recent()
  }
}

export function mockEmptySurveyResult (surveyModel?: SurveyModel): SurveyResultModel {
  const survey = surveyModel || mockSurvey()
  return {
    ...survey,
    surveyId: survey.id,
    question: survey.question,
    date: survey.date,
    answers: survey.answers.map(answer => ({
      ...answer,
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false
    }))
  }
}

export function mockSaveSurveyResultParams (): SaveSurveyResultParams {
  return {
    accountId: faker.datatype.uuid(),
    surveyId: faker.datatype.uuid(),
    answer: faker.lorem.sentence(),
    date: new Date()
  }
}
