import { NextFunction, Request, Response } from 'express'
import { Middleware } from '@/presentation/protocols'

export function adaptMiddleware (middleware: Middleware) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const httpRequest: any = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {})
    }
    try {
      const request = await middleware.handle(httpRequest)
      if (request.statusCode >= 200 && request.statusCode <= 299) {
        Object.assign(req, request.body)
        return next()
      } else {
        res.status(request.statusCode).json(request.body)
      }
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
}
