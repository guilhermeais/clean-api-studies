import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async diconnect (): Promise<void> {
    this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map: (accountData: any): any => {
    const { _id, ...accountWithoutId } = accountData
    const account = Object.assign({}, accountWithoutId, { id: _id.toHexString() })

    return account
  }

}
