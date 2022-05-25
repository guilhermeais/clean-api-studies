import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection
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

  test('Should return an account on add success', async () => {
    const sut = new AccountMongoRepository()
    const mockAccountInput = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const account = await sut.add(mockAccountInput)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(mockAccountInput.name)
    expect(account.email).toBe(mockAccountInput.email)
    expect(account.password).toBe(mockAccountInput.password)
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository()
    const mockAccountInput = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await accountCollection.insertOne(mockAccountInput)
    const account = await sut.loadByEmail('valid_email@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(mockAccountInput.name)
    expect(account.email).toBe(mockAccountInput.email)
    expect(account.password).toBe(mockAccountInput.password)
  })
})
