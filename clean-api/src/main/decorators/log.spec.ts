import { LogErrorRepository } from '../../data/potocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

function makeLogErrorRepository (): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

function makeController (): Controller {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          email: 'some_email@mail.com',
          name: 'some_Name',
          password: 'some_password',
          passwordConfirmation: 'some_password'
        }
      }

      return await Promise.resolve(httpResponse)
    }
  }

  return new ControllerStub()
}

function makeSut (): SutTypes {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut, controllerStub, logErrorRepositoryStub
  }
}
describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        name: 'some_Name',
        password: 'some_password',
        passwordConfirmation: 'some_password'
      }
    }
    await sut.handle(httpRequest)
    expect(controllerStub.handle).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the smae result of the controller handle', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        name: 'some_Name',
        password: 'some_password',
        passwordConfirmation: 'some_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        email: 'some_email@mail.com',
        name: 'some_Name',
        password: 'some_password',
        passwordConfirmation: 'some_password'
      }
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const httpErrorResponse = serverError(fakeError)
    jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(httpErrorResponse)
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        name: 'some_Name',
        password: 'some_password',
        passwordConfirmation: 'some_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(logErrorRepositoryStub.log).toHaveBeenCalledWith(fakeError.stack)
    expect(httpResponse).toEqual(httpErrorResponse)
  })
})
