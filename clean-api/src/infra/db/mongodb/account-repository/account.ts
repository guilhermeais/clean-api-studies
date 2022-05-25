import { AddAccountRepository } from '../../../../data/potocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/potocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
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
}
