import { homedir } from 'os'
import { resolve } from 'path'
import { AppTemplate } from './types'

export const GQL_URL = 'https://app.tribe.so/api/global/gateway'
export const DEV_GQL_URL = 'https://app.dev.tribe.so/api/global/gateway'

export const OFFICIAL_EMAILS = ['@tribe.so', '@bettermode.com']
export const REPO_URL = 'git@github.com:tribeplatform/cli.git'
export const RC_FILE_NAME = '.bettermoderc'
export const RC_LOCATION =
  process.env.BETTERMODE_RC_LOCATION || resolve(homedir(), RC_FILE_NAME)

export const APP_TEMPLATE_CHOICES: Record<AppTemplate, string> = {
  typescript: 'TypeScript',
}

export const CONFIG_MAPPER: Record<string, string> = {
  accessToken: 'ACCESS_TOKEN',
  email: 'EMAIL',
  official: 'OFFICIAL',
}
export const REVERSE_CONFIG_MAPPER = Object.fromEntries(
  Object.entries(CONFIG_MAPPER).map(([key, value]) => [value, key]),
)
