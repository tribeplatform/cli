import {
  PermissionContext,
  StoreItemStanding,
  StoreItemStatus,
} from '@tribeplatform/gql-client/global-types'

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
  state: string
  condition: string

  name?: string
  description?: string
  favicon?: string
}

export type ShortcutConfigs = {
  context: PermissionContext
  entityType?: string

  name: string
  description?: string
  favicon?: string

  key: string
  interactionUrl?: string
  states?: ShortcutStateConfigs[]
}

export type DefaultDynamicBlockConfigs = {
  key: string
  interactionUrl?: string
  contexts?: PermissionContext[]
}

export type DynamicBlockConfigs = DefaultDynamicBlockConfigs & {
  name: string
  description?: string
  favicon?: string
  image?: string
}

export type BlocksConfigs = {
  defaults?: DefaultDynamicBlockConfigs[]
  customs?: DynamicBlockConfigs[]
}

export type CustomCodeConfigs = {
  head?: string
  body?: string
}

export type CollaboratorConfigs = string[]

export type AppConfigs = {
  webhookUrl?: string
  interactionUrl?: string
  federatedSearchUrl?: string
  redirectUris?: string[]
  federatedSearchEnabled: boolean
  webhookSubscriptions?: string[]
}

export type AppInfo = {
  id: string
  name: string
  slug: string
  status: StoreItemStatus
  standing: StoreItemStanding
  description?: string
  favicon?: string
  image?: string
  authorName?: string
  authorUrl?: string
  privacyPolicyUrl?: string
  termsOfServiceUrl?: string
}

export type LocalConfigs = {
  info?: AppInfo
  configs?: AppConfigs
  collaborators?: CollaboratorConfigs
  customCodes?: CustomCodeConfigs
  shortcuts?: ShortcutConfigs[]
  blocks?: BlocksConfigs
}
