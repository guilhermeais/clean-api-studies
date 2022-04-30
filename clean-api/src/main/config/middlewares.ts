import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { contentType } from '../middlewares/content-type'
import { cors } from '../middlewares/cors'

export function setupMiddlewares (app: Express): void {
  app.use(contentType)
  app.use(bodyParser)
  app.use(cors)
}
