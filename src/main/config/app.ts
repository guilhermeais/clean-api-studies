import express from 'express'
import { setupSwagger } from './swagger'
import { setupMiddlewares } from './middlewares'
import { setupRoutes } from './routes'
import { setupStaticFiles } from './static-files'
import { setupApolloServer } from './apollo-server'

const app = express()
setupStaticFiles(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
setupApolloServer(app)

export default app
