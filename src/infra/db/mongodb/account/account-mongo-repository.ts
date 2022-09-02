import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '@/domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)

    const mongoAccount = await accountCollection.findOne({ _id: insertedId })
    return mongoAccount !== null
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountMongo = await accountCollection.findOne(
      {
        email
      },
      {
        projection: {
          _id: 1,
          name: 1,
          password: 1
        }
      }
    )

    return accountMongo && MongoHelper.map(accountMongo)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { accessToken: token } })
  }

  async loadByToken (params: LoadAccountByTokenRepository.Params): Promise<LoadAccountByTokenRepository.Result> {
    const { accessToken: token, role } = params
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountMongo = await accountCollection.findOne(
      {
        accessToken: token,
        $or: [
          {
            role
          },
          {
            role: 'admin'
          }
        ]
      }
    )

    return accountMongo && MongoHelper.map(accountMongo) as AccountModel
  }
}
