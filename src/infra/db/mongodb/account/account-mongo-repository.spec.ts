import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

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

  describe('add()', () => {
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
  })
  describe('loadByEmail', () => {
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

    test('Should return null if loadByEmail fails', async () => {
      const sut = new AccountMongoRepository()

      const account = await sut.loadByEmail('valid_email@mail.com')

      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = new AccountMongoRepository()
      const mockAccountInput = {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      const { insertedId } = await accountCollection.insertOne(mockAccountInput)
      const id = insertedId
      const account = await accountCollection.findOne({ _id: id })
      expect(account).toBeTruthy()

      expect(account.accessToken).toBeFalsy()
      await sut.updateAccessToken(id.toString(), 'any_token')

      const accountWithTokenUpdated = await accountCollection.findOne({ _id: id })
      expect(accountWithTokenUpdated.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = new AccountMongoRepository()
      const accessToken = 'any_token'
      const mockAccountInput = {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        accessToken
      }
      await accountCollection.insertOne(mockAccountInput)
      const account = await sut.loadByToken(accessToken)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAccountInput.name)
      expect(account.email).toBe(mockAccountInput.email)
      expect(account.password).toBe(mockAccountInput.password)
    })

    test('Should return an account on loadByToken with role', async () => {
      const sut = new AccountMongoRepository()
      const accessToken = 'any_token'
      const mockAccountInput = {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        accessToken,
        role: 'any_role'
      }
      await accountCollection.insertOne(mockAccountInput)
      const account = await sut.loadByToken(accessToken, 'any_role')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAccountInput.name)
      expect(account.email).toBe(mockAccountInput.email)
      expect(account.password).toBe(mockAccountInput.password)
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
