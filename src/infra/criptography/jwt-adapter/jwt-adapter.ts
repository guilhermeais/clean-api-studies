import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/potocols/criptography/decrypter'
import { Encrypter } from '../../../data/potocols/criptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return await Promise.resolve(accessToken)
  }

  async decrypt (token: string): Promise<string> {
    await jwt.verify(token, this.secret)
    return null
  }
}
