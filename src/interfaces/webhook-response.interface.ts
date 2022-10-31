import { ErrorCodes, WebhookStatus, WebhookType } from '@enums'
import { FederatedSearchResult } from './federated-search.interface'
import { InteractionData } from './interaction.interface'
import { CustomSettings } from './settings.interface'
import { Challenge } from './webhook.interface'

export type BaseSuccessWebhookResponse = {
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
  errorCode: ErrorCodes
  errorMessage: string
}

export type GeneralWebhookResponse = SuccessWebhookResponse | FailedWebhookResponse

export type BaseWebhookResponse = SuccessWebhookResponse | FailedWebhookResponse

export type TestWebhookResponse = BaseWebhookResponse & {
  type: WebhookType.Test
  data: Challenge
}

export type FederatedSearchWebhookResponse = BaseWebhookResponse & {
  type: WebhookType.FederatedSearch
  data: FederatedSearchResult & BaseSuccessWebhookResponse
}

export type InteractionWebhookResponse = BaseWebhookResponse & {
  type: WebhookType.Interaction
  data: InteractionData & BaseSuccessWebhookResponse
}

export type WebhookResponse =
  | GeneralWebhookResponse
  | TestWebhookResponse
  | FederatedSearchWebhookResponse
  | InteractionWebhookResponse
