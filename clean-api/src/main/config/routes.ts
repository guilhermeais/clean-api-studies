import { Express, Router } from 'express'
import fg from 'fast-glob'

function getAllRoutesFileFromRoutesFolder (): string[] {
  return fg.sync('**/src/main/routes/**routes.ts')
}

async function getRouterFromRouteFile (routerFilePath: string): Promise<Function> {
  const route = (await import(`../../../${routerFilePath}`)).default
  return route as Function
}

function addAllRoutesFromFileToRouter (router: Router, filesRoutesPath: string[]): void {
  filesRoutesPath.map(async file => {
    const route = await getRouterFromRouteFile(file)
    route(router)
  })
}
export function setupRoutes (app: Express): void {
  const router = Router()
  app.use('/api', router)
  const filesRoutesPath = getAllRoutesFileFromRoutesFolder()
  addAllRoutesFromFileToRouter(router, filesRoutesPath)
}
