import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/potocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/potocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/potocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)

    const accountMongo = await accountCollection.findOne({ _id: insertedId })
    return MongoHelper.map(accountMongo) as AccountModel
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountMongo = await accountCollection.findOne({ email })

    return accountMongo && MongoHelper.map(accountMongo) as AccountModel
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { accessToken: token } })
  }
}
