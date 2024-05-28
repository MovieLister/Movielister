class ExtendedError extends Error {
  errorCode: number
  constructor(errorCode: number, message: string) {
    super(message)
    this.name = this.constructor.name
    this.errorCode = errorCode
  }
}

export default ExtendedError
