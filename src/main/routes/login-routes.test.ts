import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
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

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Guilherme Teixeira Ais',
          email: 'guilherme.teixeira@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = '123'
      const passwordHashed = await hash(password, 12)
      const mockAccount = {
        name: 'Guilherme Teixeira Ais',
        email: 'guilherme.teixeira@gmail.com',
        password: passwordHashed
      }

      await accountCollection.insertOne(mockAccount)
      await request(app)
        .post('/api/login')
        .send({
          email: mockAccount.email,
          password: password
        })
        .expect(200)
    })

    test('Should return 401 on signup', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'guilhermeteixeiraais@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
