import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

function makeSut (): SurveyMongoRepository {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection
  beforeAll(async () => {
    const mongoURL = process.env.MONGO_URL ?? ''
    await MongoHelper.connect(mongoURL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should create a survey on add success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      })

      const survey = await surveyCollection.findOne({
        question: 'any_question'
      })
      expect(survey).toBeTruthy()
    })
  })
})
