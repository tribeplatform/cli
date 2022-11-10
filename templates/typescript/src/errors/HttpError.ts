import { HttpError as RoutingHttpError } from 'routing-controllers'

export type ErrorAdditionalInfo = Omit<Record<string, unknown>, 'error'> & {
  error?: Error
}

export class HttpError extends RoutingHttpError {
  public status: number
  public message: string
  public additionalInfo?: Omit<Record<string, unknown>, 'error'>
  public originalError?: Error

  constructor(status: number, message: string, additionalInfo?: ErrorAdditionalInfo) {
    super(status, message)
    this.status = status
    this.message = message
    this.additionalInfo = { ...additionalInfo, error: undefined }
    this.originalError = additionalInfo?.error
    if (this.originalError) {
      this.stack = this.originalError.stack
    }

    // Ensure the name of this error is the same as the class name
    this.name = HttpError.name
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    // @see Node.js reference (bottom)
    Error.captureStackTrace(this, HttpError)
  }
}
