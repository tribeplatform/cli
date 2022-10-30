import {
  AppInstallationContext,
  AppInstallationStatus,
  PrimaryScopes,
  WebhookContext,
} from '@enums'
import { TemplateMapping } from './template-mapping.interface'

export class AppSetting {
  id: string
  appId: string
  networkId: string
  context: WebhookContext
  entityId: string
  settings: Record<string, string>
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
