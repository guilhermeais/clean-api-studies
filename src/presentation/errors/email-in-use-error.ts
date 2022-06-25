export class EmailInUseError extends Error {
  constructor () {
    super()
    this.name = 'EmailInUseError'
    this.message = 'The received email is already in use'
  }
}
