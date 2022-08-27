import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'
import { mockAddAccountParams } from '@/domain/test'
import { faker } from '@faker-js/faker'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

function makeSut (): SurveyResultMongoRepository {
  return new SurveyResultMongoRepository()
}

async function mockSurvey (): Promise<SurveyModel> {
  const addSurveyMock = {
    question: faker.lorem.sentence(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.lorem.sentence()
      },
      {
        answer: faker.lorem.sentence()
      },
      {
        answer: faker.lorem.sentence()
      }
    ],
    date: faker.date.recent()
  }
  const { insertedId } = await surveyCollection.insertOne(addSurveyMock)
  return MongoHelper.map(await surveyCollection.findOne({ _id: insertedId }))
}

async function mockAccount (): Promise<AccountModel> {
  const accountMock = mockAddAccountParams()
  const { insertedId } = await accountCollection.insertOne(accountMock)
  return MongoHelper.map(await accountCollection.findOne({ _id: insertedId }))
}

describe('Survey Mongo Repository', () => {
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

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should create a survey result if its new', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id)
      })

      expect(surveyResult).toBeTruthy()
    })

    test('Should update a survey result if its not new', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection
        .find({
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id)
        })
        .toArray()

      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const secondAccount = await mockAccount()

      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(secondAccount.id),
          answer: survey.answers[0].answer,
          date: new Date()
        }
      ])

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId.toString()).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)

      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result 2', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const secondAccount = await mockAccount()
      const thirdAccount = await mockAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(secondAccount.id),
          answer: survey.answers[1].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(thirdAccount.id),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ])

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, secondAccount.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId.toString()).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(67)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)

      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(33)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result 3', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const secondAccount = await mockAccount()
      const thirdAccount = await mockAccount()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(secondAccount.id),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ])

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, thirdAccount.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId.toString()).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)

      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should return null if there is no survey result', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account.id)

      expect(surveyResult).toBeNull()
    })
  })
})
