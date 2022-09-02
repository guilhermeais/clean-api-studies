import { LogErrorRepositorySpy } from '@/data/test'
import { serverError } from '@/presentation/helpers/http/http-helper'
import { HttpResponse } from '@/presentation/protocols'
import { ControllerSpy } from '@/presentation/test'
import { faker } from '@faker-js/faker'
import { LogControllerDecorator } from './log-controller-decorator'

function mockRequest (): any {
  return {
    body: {
      [faker.random.word()]: faker.random.word()
    }
  }
}

function makeFakeServerError (): HttpResponse {
  const fakeError = new Error()
  fakeError.stack = faker.lorem.paragraph()
  const httpErrorResponse = serverError(fakeError)

  return httpErrorResponse
}
type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

function makeSut (): SutTypes {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)

  return {
    sut, controllerSpy, logErrorRepositorySpy
  }
}
describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(controllerSpy.httpRequest).toEqual(httpRequest)
  })

  test('Should return the same result of the controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = makeFakeServerError()

    controllerSpy.httpResponse = serverError
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
    expect(httpResponse).toEqual(serverError)
  })
})
