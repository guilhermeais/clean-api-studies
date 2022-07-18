import { Request, Response } from 'express'
import { Controller, HttpRequest } from '@/presentation/protocols'

export function adaptRoute (controller: Controller) {
  return async function (req: Request, res: Response): Promise<void> {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    try {
      const httpResponse = await controller.handle(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
}
