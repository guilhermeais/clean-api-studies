import { Request, Response } from 'express'
import { Controller, HttpRequest } from '@/presentation/protocols'

export function adaptRoute (controller: Controller) {
  return async function (req: Request, res: Response): Promise<void> {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    }
    try {
      const httpResponse = await controller.handle(httpRequest)
      if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        res.status(httpResponse.statusCode).json(httpResponse.body)
        return
      }

      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
}
