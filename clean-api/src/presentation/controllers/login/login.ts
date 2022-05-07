import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export default class LoginController implements Controller {
  async handle (HttpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(badRequest(new MissingParamError('email')))
  }
}
