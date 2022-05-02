export class ServerError extends Error {
  constructor (stack: string) {
    super()
    this.name = 'ServerError'
    this.message = 'Internal Server Error'
    this.stack = stack
  }
}
