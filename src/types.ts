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
  favicon?: string
}

export type Shortcut = {
  context?: Context
  entityType?: string

  name?: string
  description?: string
  favicon?: string

  callbackId?: string
  callbackUrl?: string
  states?: ShortcutState[]
}

export type DynamicBlock = {
  contexts?: Context[]

  slug?: string
  name?: string
  description?: string
  favicon?: string
  image?: string

  callbackUrl?: string
}

export type LocalConfigs = {
  id?: string
  name?: string
  slug?: string
  status?: StoreItemStatus
  standing?: StoreItemStanding

  webhookUrl?: string
  federatedSearchUrl?: string
  interactionUrl?: string
  redirectUris?: string[]

  description?: string
  favicon?: string
  image?: string

  collaborators?: string[]
  webhookSubscriptions?: string[]

  shortcuts?: Shortcut[]
  blocks?: DynamicBlock[]
}
