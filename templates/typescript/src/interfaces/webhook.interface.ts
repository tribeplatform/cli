import { WebhookContext, WebhookType } from '@enums'
import { AppInstallation, AppSettings } from './app.interface'
import { Event } from './event.interface'
import { FederatedSearch } from './federated-search.interface'
import { InteractionInput } from './interaction.interface'

export interface Challenge {
  challenge: string
}

export interface BaseWebhook {
  type: WebhookType
  networkId: string
  context: WebhookContext
  entityId?: string
  currentSettings: AppSettings[]
  data?: unknown
}

export interface TestWebhook extends BaseWebhook {
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
  data: InteractionInput
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
