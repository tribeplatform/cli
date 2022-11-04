import {
  StoreItemStanding,
  StoreItemStatus,
} from '@tribeplatform/gql-client/global-types'

export type Context = 'NETWORK' | 'MEMBER' | 'SPACE' | 'POST'

export type AppTemplate = 'typescript'

export type GlobalConfigs = {
  accessToken?: string
  email?: string
  official?: boolean
}

export type ShortcutState = {
  state?: string
  condition?: string

  name?: string
  description?: string
  faviconPath?: string
}

export type Shortcut = {
  context?: Context
  entityType?: string

  name?: string
  description?: string
  faviconPath?: string

  callbackId?: string
  callbackUrl?: string
  states?: ShortcutState[]
}

export type DynamicBlock = {
  contexts?: Context[]
  entityType?: string

  slug?: string
  name?: string
  description?: string
  faviconPath?: string
  imagePath?: string

  callbackUrl?: string
}

export type LocalConfigs = {
  id?: string
  name?: string
  slug?: string

  baseUrl?: string
  webhookUrl?: string
  federatedSearchUrl?: string
  interactionUrl?: string
  redirectUris?: string[]

  status?: StoreItemStatus
  standing?: StoreItemStanding

  webhookSubscriptions?: string[]

  shortcuts?: Shortcut[]
  blocks?: DynamicBlock[]
  settingsBlock?: DynamicBlock[]
}
