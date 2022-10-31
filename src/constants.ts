import { homedir } from 'os'
import { resolve } from 'path'

export const CUSTOM_API_TOKEN = process.env.BETTERMODE_API_TOKEN
export const RC_LOCATION =
  process.env.BETTERMODE_RC_LOCATION || resolve(homedir(), '.bettermoderc')

export const AUTH_KEY = 'TOKEN'
