import { homedir } from 'os'
import { resolve } from 'path'
import { AppTemplate } from './types'

export const GQL_URL = 'https://app.tribe.so/api/global/gateway'
export const DEV_GQL_URL = 'https://app.dev.tribe.so/api/global/gateway'

export const OFFICIAL_PARTNER_EMAILS = ['@tribe.so', '@bettermode.com']
export const REPO_URL = 'git@github.com:tribeplatform/cli.git'

export const LOCAL_RC_FOLDER_NAME = '.bettermode'
export const LOCAL_RC_DEV_FOLDER_NAME = LOCAL_RC_FOLDER_NAME + '.dev'
export const LOCAL_RC_INFO_FILE_NAME = 'info.json'
export const LOCAL_RC_CONFIG_FILE_NAME = 'configs.json'
export const LOCAL_RC_COLLABORATOR_FILE_NAME = 'collaborators.json'
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

export const TYPEFACE = `
   ___      _   _                                _      
  / __\\ ___| |_| |_ ___ _ __ _ __ ___   ___   __| | ___ 
 /__\\/// _ \\ __| __/ _ \\ '__| '_ \` _ \\ / _ \\ / _\` |/ _ \\
/ \\/  \\  __/ |_| ||  __/ |  | | | | | | (_) | (_| |  __/
\\_____/\\___|\\__|\\__\\___|_|  |_| |_| |_|\\___/ \\__,_|\\___|

`

export const PUBLIC_PUBLISH_MESSAGE = `
This command will result in your app being published to the public Bettermode app store.
It means that anyone can use your app in their Bettermode store.

By publishing your app, you agree to the Bettermode terms of service and privacy policy:
https://bettermode.com/terms-of-service
https://bettermode.com/private-policy
`

export const PUBLIC_UNPUBLISH_MESSAGE = `
This command will result in your app being unpublished from the public Bettermode app store.
It means that no one can see your app in their Bettermode store.
Also, all your app installations will be removed, and all associated settings will be deleted.
`
