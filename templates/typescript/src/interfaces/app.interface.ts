import { AppInstallationContext, AppInstallationStatus, PrimaryScope } from '@enums'
import {
  NetworkMembership,
  NetworkStatus,
  NetworkVisibility,
  PermissionContext,
  PlanName,
} from '@tribeplatform/gql-client/types'

import { CustomSettings } from './settings.interface'
import { TemplateMapping } from './template-mapping.interface'

export class AppSettings {
  id: string
  appId: string
  networkId: string
  context: PermissionContext
  entityId: string
  settings: CustomSettings
}

export interface AppInstallationTemplatesMappings {
  postTypes?: TemplateMapping[]
  memberTypes?: TemplateMapping[]
}

export interface NetworkInfo {
  id: string
  createdAt: Date

  graphqlUrl: string
  domain: string
  domainSubfolder?: string
  aliases?: string[]

  membership: NetworkMembership
  plan: PlanName
  status: NetworkStatus
  visibility: NetworkVisibility

  name: string
  logoId?: string
  faviconId?: string
  description?: string
}

export interface AppInstallation {
  id: string
  networkId: string
  networkInfo: NetworkInfo

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
  permissions: PrimaryScope[]

  uninstallationReason?: string

  templatesMappings?: AppInstallationTemplatesMappings
}
