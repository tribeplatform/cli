import { ErrorCodes, WebhookStatus, WebhookType } from '@enums'
import { FederatedSearchResult } from './federated-search.interface'
import { Challenge } from './webhook.interface'

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

export type TestWebhookResponse = BaseWebhookResponse & {
  type: WebhookType.Test
  data: Challenge
}

export type FederatedSearchWebhookResponse = BaseWebhookResponse & {
  type: WebhookType.FederatedSearch
  data: FederatedSearchResult
}

export type WebhookResponse =
  | GeneralWebhookResponse
  | TestWebhookResponse
  | FederatedSearchWebhookResponse
