import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient | null,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },
  async diconnect (): Promise<void> {
    this.client.close()
  }
}
