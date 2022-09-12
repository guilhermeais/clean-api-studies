import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { makeApolloServer } from './helpers'

import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { ApolloServer, gql } from 'apollo-server-express'
import { faker } from '@faker-js/faker'

describe('Login GraphQL', () => {
  let accountCollection: Collection
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
  })

  describe('Login Query', () => {
    test('should return an account on valid credentials', async () => {
      const loginQuery = gql`
        query login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            accessToken
            name
          }
        }
      `
      const password = faker.datatype.uuid()
      const passwordHashed = await hash(password, 12)
      const mockAccount = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: passwordHashed
      }

      await accountCollection.insertOne(mockAccount)

      const { query } = createTestClient({
        apolloServer
      })

      const res: any = await query(loginQuery, {
        variables: {
          email: mockAccount.email,
          password: password
        }
      })

      expect(res.data.login.accessToken).toBeTruthy()
      expect(res.data.login.name).toBe(mockAccount.name)
    })

    test('should return UnauthorizedERror on invalid credentials', async () => {
      const loginQuery = gql`
        query login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            accessToken
            name
          }
        }
      `
      const { query } = createTestClient({
        apolloServer
      })

      const res: any = await query(loginQuery, {
        variables: {
          email: faker.internet.email(),
          password: faker.internet.password()
        }
      })

      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    test('should return an account on valid data', async () => {
      const signUpMutation = gql`
        mutation signUp($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
          signUp(name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
            accessToken
            name
          }
        }
      `
      const password = faker.datatype.uuid()

      const mockAccount = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password
      }

      const { mutate } = createTestClient({
        apolloServer
      })

      const res: any = await mutate(signUpMutation, {
        variables: {
          name: mockAccount.name,
          email: mockAccount.email,
          password: mockAccount.password,
          passwordConfirmation: mockAccount.passwordConfirmation
        }
      })

      expect(res.data.signUp.accessToken).toBeTruthy()
      expect(res.data.signUp.name).toBe(mockAccount.name)
    })
  })
})
