import { HttpResponse } from './http'

export interface Middleware<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}
