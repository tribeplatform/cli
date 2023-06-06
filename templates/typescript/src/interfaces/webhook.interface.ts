import { WebhookType } from '@enums'
import { Member, Network, PermissionContext } from '@tribeplatform/gql-client/types'

import { AppInstallation, AppSettings } from './app.interface'
import { BaseEventObject, Event } from './event.interface'
import { FederatedSearch } from './federated-search.interface'
import { InteractionInput } from './interaction.interface'
import { ShortcutStatesInput } from './shortcut-states.interface'

export interface Challenge {
  challenge: string
}

// Use Lite types
export interface WebhookEntities {
  network?: Network
  actor?: Member
  owner?: Member
  targetMember?: Member
}

export interface BaseWebhook {
  type: WebhookType
  networkId: string
  context: PermissionContext
  entityId?: string
  currentSettings: AppSettings[]
  data?: unknown
  entities?: WebhookEntities
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

export interface ShortcutStatesWebhook extends BaseWebhook {
  type: WebhookType.ShortcutsStates
  data: ShortcutStatesInput
}

export interface SubscriptionWebhook<T extends BaseEventObject = BaseEventObject>
  extends BaseWebhook {
  type: WebhookType.Subscription
  data: Event<T>
}

export type Webhook =
  | TestWebhook
  | AppInstalledWebhook
  | AppUninstalledWebhook
  | FederatedSearchWebhook
  | InteractionWebhook
  | ShortcutStatesWebhook
  | SubscriptionWebhook
