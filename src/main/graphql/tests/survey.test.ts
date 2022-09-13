import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { makeApolloServer } from './helpers'

import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'
import { ApolloServer, gql } from 'apollo-server-express'
import { faker } from '@faker-js/faker'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

describe('Survey GraphQL', () => {
  async function mockAccessToken (role?: string): Promise<string> {
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

  describe('Surveys Query', () => {
    const surveysQuery = gql`
        query surveys {
          surveys {
            id
            question
            answers {
              image
              answer
            }
            date
            didAnswer
          }
        }
      `
    test('should return surveys on success', async () => {
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

      await surveyCollection.insertOne(
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

      const res: any = await query(surveysQuery)

      expect(res.data.surveys.length).toBe(1)
      expect(res.data.surveys[0]).toEqual({ ...mockedSurvey, date: now.toISOString(), id: expect.any(String), didAnswer: false })
    })

    test('should return AccessDeniedError if no token is provided', async () => {
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

      await surveyCollection.insertOne(
        { ...mockedSurvey }
      )
      const { query } = createTestClient({
        apolloServer
      })

      const res: any = await query(surveysQuery)

      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access Denied')
    })
  })
})
