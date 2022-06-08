import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/potocols/criptography/hash-comparer'
import { Hasher } from '../../../data/potocols/criptography/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
