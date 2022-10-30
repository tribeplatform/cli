import { AppInstallationContext, AppInstallationStatus, PrimaryScopes } from '@enums'
import { TemplateMapping } from './template-mapping.interface'

export interface Challenge {
  challenge: string
}

export interface FederatedSearch {
  query: string
}

export interface Interaction<P = Record<string, unknown>> {
  actorId: string
  appId: string
  interactionId: string
  dynamicBlockId?: string
  callbackId?: string
  shortcutState?: string
  inputs?: P
}

export interface AppInstallationTemplatesMappings {
  postTypes?: TemplateMapping[]
  memberTypes?: TemplateMapping[]
}

export interface AppInstallation {
  id: string
  networkId: string

  appId: string
  appVersion?: string

  installedById?: string
  uninstalledById?: string

  createdAt: Date
  updatedAt: Date
  installedAt: Date

  status: AppInstallationStatus
  context: AppInstallationContext
  entityId: string
  permissions: PrimaryScopes[]

  uninstallationReason?: string

  templatesMappings?: AppInstallationTemplatesMappings
}
