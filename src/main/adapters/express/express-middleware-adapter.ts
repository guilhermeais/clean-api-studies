import { NextFunction, Request, Response } from 'express'
import { HttpRequest, Middleware } from '@/presentation/protocols'

export function adaptMiddleware (middleware: Middleware) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    try {
      const httpResponse = await middleware.handle(httpRequest)
      if (httpResponse.statusCode === 200) {
        Object.assign(req, httpResponse.body)
        return next()
      } else {
        res.status(httpResponse.statusCode).json(httpResponse.body)
      }
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
}
