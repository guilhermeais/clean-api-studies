import { mockAccount } from '@/domain/test'
import { ok } from '../helpers/http/http-helper'
import { Controller, HttpResponse } from '../protocols'

export class ControllerSpy implements Controller {
  httpRequest: any
  httpResponse = ok(mockAccount)
  async handle (httpRequest: any): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return await Promise.resolve(this.httpResponse)
  }
}
