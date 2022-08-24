import { faker } from '@faker-js/faker'
import { SurveyModel } from '../models/survey'
import { AddSurveyParams } from '../usecases/survey/add-survey'

export function mockAddSurveyParams (): AddSurveyParams {
  return {
    question: faker.lorem.sentence(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.lorem.sentence()
      }
    ],
    date: faker.date.recent()
  }
}

export function mockSurvey (): SurveyModel {
  return {
    id: faker.datatype.uuid(),
    question: faker.lorem.sentence(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.lorem.sentence()
      }
    ],
    date: faker.date.recent(),
    didAnswer: faker.datatype.boolean()
  }
}

export function mockSurveys (): SurveyModel[] {
  return [
    {
      id: faker.datatype.uuid(),
      question: faker.lorem.sentence(),
      answers: [
        {
          image: faker.image.imageUrl(),
          answer: faker.lorem.sentence()
        }
      ],
      didAnswer: faker.datatype.boolean(),
      date: faker.date.recent()
    },
    {
      id: faker.datatype.uuid(),
      question: faker.lorem.sentence(),
      answers: [
        {
          answer: faker.lorem.sentence()
        }
      ],
      didAnswer: faker.datatype.boolean(),
      date: faker.date.recent()
    }
  ]
}
