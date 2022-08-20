import { mockAccount } from '@/domain/test'
import { ok } from '../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../protocols'

export class ControllerSpy implements Controller {
  httpRequest: HttpRequest
  httpResponse = ok(mockAccount)
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return await Promise.resolve(this.httpResponse)
  }
}
