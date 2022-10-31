import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { AppLanguage } from './types'

export const RC_LOCATION =
  process.env.BETTERMODE_RC_LOCATION || resolve(homedir(), '.bettermoderc')

export const AUTH_KEY = 'TOKEN'

export const APP_LANGUAGE_CHOICES: Record<AppLanguage, string> = {
  ts: 'TypeScript',
}
