import { ErrorCodes, WebhookContext, WebhookStatus, WebhookType } from '@enums'
import { AppInstallation, AppSetting } from './app.interface'
import { Event } from './event.interface'
import { FederatedSearch } from './federated-search.interface'
import { Interaction } from './interaction.interface'

export interface Challenge {
  challenge: string
}

export interface BaseWebhook {
  type: WebhookType
  networkId: string
  context: WebhookContext
  entityId?: string
  currentSettings: AppSetting[]
  data?: unknown
}

export interface SuccessWebhookResponse {
  type: WebhookType
  status: WebhookStatus.Succeeded
  data?: unknown
}

export interface GeneralSuccessWebhookResponse extends SuccessWebhookResponse {
  data?: Record<string, never>
}

export interface FailedWebhookResponse {
  type: WebhookType
  status: WebhookStatus.Failed
  errorCode: ErrorCodes
  errorMessage: string
}

export type GeneralWebhookResponse = GeneralSuccessWebhookResponse | FailedWebhookResponse

export type BaseWebhookResponse = SuccessWebhookResponse | FailedWebhookResponse

export interface TestWebhook extends BaseWebhook {
  type: WebhookType.Test
  data: Challenge
}

export type TestWebhookResponse = BaseWebhookResponse & {
  type: WebhookType.Test
  data: Challenge
}

export interface AppInstalledWebhook extends BaseWebhook {
  type: WebhookType.AppInstalled
  data: AppInstallation
}

export interface AppUninstalledWebhook extends BaseWebhook {
  type: WebhookType.AppUninstalled
  data: AppInstallation
}

export interface FederatedSearchWebhook extends BaseWebhook {
  type: WebhookType.FederatedSearch
  data: FederatedSearch
}

export interface InteractionWebhook extends BaseWebhook {
  type: WebhookType.Interaction
  data: Interaction
}

export interface SubscriptionWebhook extends BaseWebhook {
  type: WebhookType.Subscription
  data: Event
}

export type Webhook =
  | TestWebhook
  | AppInstalledWebhook
  | AppUninstalledWebhook
  | FederatedSearchWebhook
  | InteractionWebhook
  | SubscriptionWebhook

export type WebhookResponse = GeneralWebhookResponse | TestWebhookResponse
