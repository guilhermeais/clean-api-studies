import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import FakeObjectId from 'bson-objectid'

function makeSut (): SurveyMongoRepository {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

async function mockAccountId (): Promise<string> {
  const accountMock = mockAddAccountParams()
  const { insertedId } = await accountCollection.insertOne(accountMock)
  return insertedId.toString()
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

  describe('add()', () => {
    test('Should create a survey on add success', async () => {
      const sut = makeSut()
      const addSurveyParams = mockAddSurveyParams()
      await sut.add(addSurveyParams)

      const survey = await surveyCollection.findOne({
        question: addSurveyParams.question
      })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const accountId = await mockAccountId()

      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const { insertedIds: { 0: surveyId } } = await surveyCollection.insertMany(addSurveyModels)

      await surveyResultCollection.insertOne({
        surveyId,
        accountId: new ObjectId(accountId),
        answer: addSurveyModels[0].answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)

      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should return empty list if any survey exists', async () => {
      const sut = makeSut()
      const accountId = await mockAccountId()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })
  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const surveyMock = mockAddSurveyParams()

      const { insertedId } = await surveyCollection.insertOne(surveyMock)
      const sut = makeSut()
      const survey = await sut.loadById(insertedId.toString())
      expect(survey.id).toBeTruthy()
      expect(survey.question).toBe(surveyMock.question)
    })

    test('Should return null if survey does not exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('any_id')
      expect(survey).toBeNull()
    })
  })
  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const surveyMock = mockAddSurveyParams()

      const { insertedId } = await surveyCollection.insertOne(surveyMock)
      const sut = makeSut()
      const survey = await sut.checkById(insertedId.toString())
      expect(survey).toBe(true)
    })

    test('Should return null if survey does not exists', async () => {
      const sut = makeSut()
      const survey = await sut.checkById(new FakeObjectId().toHexString())
      expect(survey).toBe(false)
    })
  })
})
