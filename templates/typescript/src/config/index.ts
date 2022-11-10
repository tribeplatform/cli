import { LogFormat, LogLevel } from '@tribeplatform/node-logger'
import { config } from 'dotenv'
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` })

export const LOG_FORMAT = (process.env.LOG_FORMAT as LogFormat) || 'pretty'
export const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || 'verbose'
export const CREDENTIALS = process.env.CREDENTIALS === 'true'
export const IGNORE_SIGNATURE = process.env.IGNORE_SIGNATURE === 'true'
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_DIR,
  ORIGIN,
  DATABASE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  SIGNING_SECRET,
} = process.env
