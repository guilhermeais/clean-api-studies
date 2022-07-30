import { Decrypter } from '../protocols/criptography/decrypter'
import { Encrypter } from '../protocols/criptography/encrypter'
import { HashComparer } from '../protocols/criptography/hash-comparer'
import { Hasher } from '../protocols/criptography/hasher'

export function mockHasher (): Hasher {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  const hasherStub = new HasherStub()
  return hasherStub
}

export function mockDecrypter (): Decrypter {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }

  return new DecrypterStub()
}

export function mockEncrypter (): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  const encrypterStub = new EncrypterStub()
  return encrypterStub
}

export function mockHashComparer (): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  const hashComparerStub = new HashComparerStub()
  return hashComparerStub
}
