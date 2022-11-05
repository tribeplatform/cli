import {
  StoreItemStanding,
  StoreItemStatus,
} from '@tribeplatform/gql-client/global-types'

export type Context = 'NETWORK' | 'MEMBER' | 'SPACE' | 'POST'

export type AppTemplate = 'typescript'

export type GithubUser = {
  name: string
  email: string
  username?: string
}

export type GlobalConfigs = {
  accessToken?: string
  email?: string
  officialPartner?: boolean
}

export type ShortcutStateConfigs = {
  state?: string
  condition?: string

  name?: string
  description?: string
  favicon?: string
}

export type ShortcutConfigs = {
  context?: Context
  entityType?: string

  name?: string
  description?: string
  favicon?: string

  key?: string
  interactionUrl?: string
  states?: ShortcutStateConfigs[]
}

export type DefaultDynamicBlockConfigs = {
  key?: string
  interactionUrl?: string
  contexts?: Context[]
}

export type DynamicBlockConfigs = DefaultDynamicBlockConfigs & {
  name?: string
  description?: string
  favicon?: string
  image?: string
}

export type BlocksConfigs = {
  defaults?: DefaultDynamicBlockConfigs[]
  customs?: DynamicBlockConfigs[]
}

export type LocalConfigs = {
  id?: string
  name?: string
  slug?: string
  status?: StoreItemStatus
  standing?: StoreItemStanding
  description?: string
  favicon?: string
  image?: string

  configs?: {
    webhookUrl?: string
    interactionUrl?: string
    federatedSearchUrl?: string
    redirectUris?: string[]
    federatedSearchEnabled?: boolean
    collaborators?: string[]
    webhookSubscriptions?: string[]
  }
  customCodes?: {
    head?: string
    body?: string
  }
  shortcuts?: ShortcutConfigs[]
  blocks?: BlocksConfigs
}
