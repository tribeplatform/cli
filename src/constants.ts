import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { AppTemplate } from './types'

export const OFFICIAL_EMAILS = ['@tribe.so', '@bettermode.com']
export const REPO_URL = 'git@github.com:tribeplatform/cli.git'
export const RC_LOCATION =
  process.env.BETTERMODE_RC_LOCATION || resolve(homedir(), '.bettermoderc')

export const APP_TEMPLATE_CHOICES: Record<AppTemplate, string> = {
  ts: 'TypeScript',
}
