import { ErrorCode, WebhookStatus } from '@enums'
import { FederatedSearchWebhook, FederatedSearchWebhookResponse } from '@interfaces'
import { Logger } from '@utils'

const logger = new Logger(`FederatedSearch`)

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
