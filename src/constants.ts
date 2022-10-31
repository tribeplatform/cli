import { homedir } from 'node:os'
import { resolve } from 'node:path'

export const RC_LOCATION =
  process.env.BETTERMODE_RC_LOCATION || resolve(homedir(), '.bettermoderc')

export const AUTH_KEY = 'TOKEN'
