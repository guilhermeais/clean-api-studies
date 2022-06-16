import env from '../../../../main/config/env'
import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await sut.disconnect()
  })
  test('Should reconnect if mongodb is down', async () => {
    let accountColection = await sut.getCollection('accounts')
    expect(accountColection).toBeTruthy()
    await sut.disconnect()
    accountColection = await sut.getCollection('accounts')
    expect(accountColection).toBeTruthy()
  })
})
