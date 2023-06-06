import { LogFormat, LogLevel } from '@tribeplatform/node-logger'
import { config } from 'dotenv'

// eslint-disable-next-line no-process-env
const ENVS = process.env

config({ path: `.env.${ENVS.NODE_ENV || 'development'}.local` })

export const LOG_FORMAT = (ENVS.LOG_FORMAT as LogFormat) || 'pretty'
export const LOG_LEVEL = (ENVS.LOG_LEVEL as LogLevel) || 'verbose'
export const CREDENTIALS = ENVS.CREDENTIALS === 'true'
export const IGNORE_SIGNATURE = ENVS.IGNORE_SIGNATURE === 'true'
export const LOG_ACCESS = ENVS.LOG_ACCESS === 'true'
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_DIR,
  ORIGIN,
  DATABASE_URL,
  GRAPHQL_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  SIGNING_SECRET,
  SESSION_SECRET,
} = ENVS
