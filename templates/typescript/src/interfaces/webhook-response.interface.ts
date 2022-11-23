import { ErrorCode, WebhookStatus, WebhookType } from '@enums'

import { FederatedSearchResult } from './federated-search.interface'
import { InteractionData } from './interaction.interface'
import { CustomSettings } from './settings.interface'
import { ShortcutsStatesResult } from './shortcut-states.interface'
import { Challenge } from './webhook.interface'

export interface BaseSuccessWebhookResponse {
  toStore?: CustomSettings
}

export interface SuccessWebhookResponse {
  type: WebhookType
  status: WebhookStatus.Succeeded
  data?: BaseSuccessWebhookResponse
}

export interface FailedWebhookResponse {
  type: WebhookType
  status: WebhookStatus.Failed
  errorCode: ErrorCode
  errorMessage: string
}

export type GeneralWebhookResponse = SuccessWebhookResponse | FailedWebhookResponse

export type TestWebhookResponse =
  | FailedWebhookResponse
  | (SuccessWebhookResponse & {
      type: WebhookType.Test
      data: Challenge
    })

export type FederatedSearchWebhookResponse =
  | FailedWebhookResponse
  | (SuccessWebhookResponse & {
      type: WebhookType.FederatedSearch
      data: FederatedSearchResult & BaseSuccessWebhookResponse
    })

export type InteractionWebhookResponse =
  | FailedWebhookResponse
  | (SuccessWebhookResponse & {
      type: WebhookType.Interaction
      data: InteractionData & BaseSuccessWebhookResponse
    })

export type ShortcutStatesWebhookResponse =
  | FailedWebhookResponse
  | (SuccessWebhookResponse & {
      type: WebhookType.ShortcutsStates
      data: ShortcutsStatesResult & BaseSuccessWebhookResponse
    })

export type WebhookResponse =
  | GeneralWebhookResponse
  | TestWebhookResponse
  | FederatedSearchWebhookResponse
  | InteractionWebhookResponse
  | ShortcutStatesWebhookResponse
