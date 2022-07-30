import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

function isTestFile (fileName): boolean {
  return fileName.indexOf('test') > -1 || fileName.indexOf('spec') > -1
}

function isValidRouteFile (file: string): boolean {
  return (file.endsWith('.js') || file.endsWith('.ts')) && !isTestFile(file)
}

function getAllRoutesFileFromRoutesFolder (): string[] {
  const routePath = join(__dirname, '../', '/routes')
  const routesFiles = (readdirSync(routePath)).filter(isValidRouteFile)
  return routesFiles
}

async function getRouterFromRouteFile (routerFilePath: string): Promise<Function> {
  const route = (await import(`../routes/${routerFilePath}`)).default
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
