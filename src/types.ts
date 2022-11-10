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
  ngrokToken?: string
}

export type ShortcutStateConfigs = {
  state: string
  condition: string

  name: string | null
  description: string | null
  favicon: string | null
}

export type ShortcutConfigs = {
  context: PermissionContext
  entityType: string | null

  name: string
  description: string | null
  favicon: string | null

  key: string
  interactionUrl: string | null
  states: ShortcutStateConfigs[] | null
}

export type DefaultDynamicBlockConfigs = {
  key: string
  interactionUrl: string | null
  contexts: PermissionContext[] | null
}

export type DynamicBlockConfigs = DefaultDynamicBlockConfigs & {
  name: string
  description: string | null
  favicon: string | null
  image: string | null
}

export type BlocksConfigs = {
  defaults: DefaultDynamicBlockConfigs[]
  customs: DynamicBlockConfigs[]
}

export type CustomCodeConfigs = {
  head: string | null
  body: string | null
}

export type CollaboratorConfigs = string[]

export type AppConfigs = {
  webhookUrl: string | null
  interactionUrl: string | null
  federatedSearchUrl: string | null
  redirectUris: string[] | null
  federatedSearchEnabled: boolean
  webhookSubscriptions: string[] | null
}

export type AppInfo = {
  id: string
  name: string
  slug: string
  status: StoreItemStatus
  standing: StoreItemStanding
  description: string | null
  favicon: string | null
  image: string | null
  authorName: string | null
  authorUrl: string | null
  privacyPolicyUrl: string | null
  termsOfServiceUrl: string | null
}

export type LocalConfigs = {
  info?: AppInfo
  configs?: AppConfigs
  collaborators?: CollaboratorConfigs
  customCodes?: CustomCodeConfigs
  shortcuts?: ShortcutConfigs[]
  blocks?: BlocksConfigs
}
