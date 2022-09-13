import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { makeApolloServer } from './helpers'

import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'
import { ApolloServer, gql } from 'apollo-server-express'
import { faker } from '@faker-js/faker'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

describe('SurveyResult GraphQL', () => {
  async function mockAccessToken (role?: string): Promise<string> {
    const result = await accountCollection.insertOne({
      name: 'Guilherme Teixeira Ais',
      email: 'guilherme.teixeira@mail.com',
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

  let accountCollection: Collection
  let surveyCollection: Collection
  let apolloServer: ApolloServer

  beforeAll(async () => {
    apolloServer = makeApolloServer()
    const mongoURL = process.env.MONGO_URL ?? ''
    await MongoHelper.connect(mongoURL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})

    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
        query surveyResult ($surveyId: String!) {
          surveyResult (surveyId: $surveyId) {
            question
            answers {
              answer
              count
              percent
              isCurrentAccountAnswer
            }
            date
          }
        }
      `
    test('should return SurveyResult on success', async () => {
      const accessToken = await mockAccessToken()
      const now = new Date()
      const mockedSurvey = {
        question: faker.word.conjunction(),
        answers: [
          {
            answer: faker.word.adjective(),
            image: faker.image.imageUrl()
          },
          {
            answer: faker.word.adjective(),
            image: null
          }
        ],
        date: now
      }

      const { insertedId: surveyId } = await surveyCollection.insertOne(
        { ...mockedSurvey }
      )
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })

      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyId.toString()
        }
      })

      expect(res.data.surveyResult.question).toBe(mockedSurvey.question)
      expect(res.data.surveyResult.date).toBe(mockedSurvey.date.toISOString())
      expect(res.data.surveyResult.answers[0].answer).toBe(mockedSurvey.answers[0].answer)
      expect(res.data.surveyResult.answers[0].count).toBe(0)
      expect(res.data.surveyResult.answers[0].percent).toBe(0)
      expect(res.data.surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
    })
  })
})
