import { ErrorAdditionalInfo, HttpError } from './http.error'

export class InternalServerError extends HttpError {
  constructor(message: string, additionalInfo?: ErrorAdditionalInfo) {
    super(500, message, additionalInfo)

    // Ensure the name of this error is the same as the class name
    this.name = InternalServerError.name
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    // @see Node.js reference (bottom)
    Error.captureStackTrace(this, InternalServerError)
  }
}
