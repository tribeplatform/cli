import { ErrorCode, WebhookStatus } from '@enums'
import { FederatedSearchWebhook, FederatedSearchWebhookResponse } from '@interfaces'
import { globalLogger } from '@utils'

const logger = globalLogger.setContext(`FederatedSearch`)

export const handleFederatedSearchWebhook = async (
  webhook: FederatedSearchWebhook,
): Promise<FederatedSearchWebhookResponse> => {
  logger.debug('handleFederatedSearchWebhook called', { webhook })

  return {
    type: webhook.type,
    status: WebhookStatus.Failed,
    errorCode: ErrorCode.InvalidRequest,
    errorMessage: 'Federated search is not supported.',
  }
}
