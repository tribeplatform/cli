import { LOG_FORMAT, LOG_LEVEL } from '@config'
import { Logger as BettermodeLogger } from '@tribeplatform/node-logger'

export class Logger extends BettermodeLogger {
  constructor(context?: string) {
    super({
      applicationName: 'server',
      context,
      format: LOG_FORMAT,
      level: LOG_LEVEL,
    })
  }
}

const globalLogger = new Logger()

const stream = {
  write: (message: string) => {
    globalLogger.info(message.substring(0, message.lastIndexOf('\n')))
  },
}

export { globalLogger, stream }
