import { AddAccountRepository } from '../../../../data/potocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)

    const accountMongo = await accountCollection.findOne({ _id: insertedId })
    if (accountMongo?._id) {
      const { _id, ...accountWithoutId } = accountMongo
      const account = Object.assign({}, accountWithoutId, { id: _id.toHexString() })

      return account as AccountModel
    }
  }
}
