import { ErrorCodes, WebhookStatus } from '@enums'
import { FailedWebhookResponse, Webhook } from '@interfaces'

export const getServiceUnavailableError = (webhook: Webhook): FailedWebhookResponse => ({
  type: webhook.type,
  status: WebhookStatus.Failed,
  errorCode: ErrorCodes.ServerError,
  errorMessage: 'Service is currently unavailable, please try again later.',
})
