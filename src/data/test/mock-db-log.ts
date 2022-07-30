import { LogErrorRepository } from '../protocols/db/log/log-error-repository'

export function mockLogErrorRepository (): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}
