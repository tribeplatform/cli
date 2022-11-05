import { homedir } from 'os'
import { resolve } from 'path'
import { AppTemplate } from './types'

export const GQL_URL = 'https://app.tribe.so/api/global/gateway'
export const DEV_GQL_URL = 'https://app.dev.tribe.so/api/global/gateway'

export const OFFICIAL_PARTNER_EMAILS = ['@tribe.so', '@bettermode.com']
export const REPO_URL = 'git@github.com:tribeplatform/cli.git'

export const LOCAL_RC_DEV_FOLDER_NAME = 'dev'

export const LOCAL_RC_FOLDER_NAME = '.bettermode'
export const LOCAL_RC_CONFIG_FILE_NAME = 'configs.json'
export const LOCAL_RC_BLOCKS_FILE_NAME = 'blocks.json'
export const LOCAL_RC_SHORTCUTS_FILE_NAME = 'shortcuts.json'
export const LOCAL_RC_CUSTOM_CODES_FOLDER_NAME = 'custom-codes'
export const LOCAL_RC_CUSTOM_CODES_FILE_FORMAT = '.liquid'

export const GLOBAL_RC_FILE_NAME = '.bettermoderc'
export const GLOBAL_RC_DEV_POSTFIX = '.dev'
export const GLOBAL_RC_LOCATION =
  process.env.BETTERMODE_RC_LOCATION || resolve(homedir(), GLOBAL_RC_FILE_NAME)

export const APP_TEMPLATE_CHOICES: Record<AppTemplate, string> = {
  typescript: 'TypeScript',
}

export const lICENSES = [
  {
    name: 'MIT',
    value: 'MIT',
  },
  {
    name: 'Apache 2.0',
    value: 'Apache-2.0',
  },
  {
    name: 'GNU GPL v3',
    value: 'GPL-3.0',
  },
  {
    name: 'ISC',
    value: 'ISC',
  },
]
