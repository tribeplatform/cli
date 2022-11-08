export class CliError extends Error {
  message = 'Unknown error.'
  actualError: Error | null = null
  args: Record<string, unknown> = {}

  constructor()
  constructor(args?: Record<string, unknown>)
  constructor(actualError?: Error, args?: Record<string, unknown>)
  constructor(message?: string, args?: Record<string, unknown>)
  constructor(message?: string, actualError?: Error, args?: Record<string, unknown>)
  constructor(
    actualErrorOrArgsOrMessage?: Error | Record<string, unknown> | string,
    actualErrorOrArgs?: Error | Record<string, unknown>,
    args?: Record<string, unknown>,
  ) {
    super()

    if (actualErrorOrArgsOrMessage && actualErrorOrArgsOrMessage instanceof Error) {
      this.actualError = actualErrorOrArgsOrMessage
    } else if (
      actualErrorOrArgsOrMessage &&
      typeof actualErrorOrArgsOrMessage === 'object'
    ) {
      this.args = actualErrorOrArgsOrMessage
    } else if (
      actualErrorOrArgsOrMessage &&
      typeof actualErrorOrArgsOrMessage === 'string'
    ) {
      this.message = actualErrorOrArgsOrMessage
    }

    if (actualErrorOrArgs && actualErrorOrArgs instanceof Error) {
      this.actualError = actualErrorOrArgs
    } else if (actualErrorOrArgs && typeof actualErrorOrArgs === 'object') {
      this.args = actualErrorOrArgs
    }

    if (args) {
      this.args = args
    }
  }
}

export class ServerError extends CliError {
  message = 'Something went wrong with the server. Please try again later.'
}

export class UnAuthorizedError extends CliError {
  message = 'You are not logged in, please login first.'
}

export class NoAppConfigError extends CliError {
  message = `No app config found, please create one first by running "bettermode app init".`
}

export class InvalidTokenError extends CliError {
  message = 'Your token is invalid or has been expired, please login again.'
}

export class LoginError extends CliError {
  message = 'Your login attempt has been failed, please try again later.'
}

export class NoAccessToFileError extends CliError {
  message = `You do not have access to this file: `

  constructor(path: string) {
    super()

    this.message += `\`${path}\`.`
  }
}
