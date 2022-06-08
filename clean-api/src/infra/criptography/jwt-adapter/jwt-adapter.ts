import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/potocols/criptography/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return await Promise.resolve(accessToken)
  }
}
