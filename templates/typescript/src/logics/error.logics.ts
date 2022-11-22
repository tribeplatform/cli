import { ErrorCode, WebhookStatus, WebhookType } from '@enums'
import { FailedWebhookResponse, Webhook } from '@interfaces'

export const getServiceUnavailableError = (webhook: Webhook): FailedWebhookResponse => ({
  type: webhook.type,
  status: WebhookStatus.Failed,
  errorCode: ErrorCode.ServerError,
  errorMessage: 'Service is currently unavailable, please try again later.',
})

export const getInteractionNotSupportedError = (
  parameterKey: string,
  parameterValue: unknown,
): FailedWebhookResponse => ({
  type: WebhookType.Interaction,
  status: WebhookStatus.Failed,
  errorCode: ErrorCode.InvalidParameter,
  errorMessage: `The interaction is not supported. '${parameterValue}' is not a supported value for '${parameterKey}'.`,
})
