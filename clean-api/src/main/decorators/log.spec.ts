import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
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
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut, controllerStub
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
})
