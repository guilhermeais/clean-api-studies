import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { mockLogErrorRepository } from '@/data/test'
import { mockAccount } from '@/domain/test'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

function mockRequest (): HttpRequest {
  const account = mockAccount()
  return {
    body: {
      ...account,
      passwordConfirmation: account.password
    }
  }
}

function makeFakeServerError (): HttpResponse {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  const httpErrorResponse = serverError(fakeError)

  return httpErrorResponse
}
type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

function makeController (): Controller {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok(mockAccount()))
    }
  }

  return new ControllerStub()
}

function makeSut (): SutTypes {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut, controllerStub, logErrorRepositoryStub
  }
}
describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    jest.spyOn(controllerStub, 'handle')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(controllerStub.handle).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller handle', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(mockAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const serverError = makeFakeServerError()
    jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(logErrorRepositoryStub.logError).toHaveBeenCalledWith(serverError.body.stack)
    expect(httpResponse).toEqual(serverError)
  })
})
