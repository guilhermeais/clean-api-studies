import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

async function makeAccessToken (role?: string): Promise<string> {
  const result = await accountCollection.insertOne({
    name: 'Guilherme Teixeira Ais',
    email: 'guilherme.teixeira@gmail.com',
    password: 'somePassword',
    ...(role && { role })
  })
  const id = result.insertedId
  const accessToken = sign({ id: id.toString() }, env.jwtSecret)

  await accountCollection.updateOne(
    {
      _id: id
    },
    {
      $set: {
        accessToken
      }
    }
  )

  return accessToken
}

describe('Survey Routes', () => {
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

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:id/results', () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_survey_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with access token', async () => {
      const accessToken = await makeAccessToken()
      const { insertedIds: { 0: surveyId } } = await surveyCollection.insertMany([
        {
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ],
          date: new Date()
        }
      ])
      await request(app)
        .put(`/api/surveys/${surveyId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })
})
