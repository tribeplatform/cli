import { ErrorCode, WebhookStatus } from '@enums'
import { InteractionWebhook, InteractionWebhookResponse } from '@interfaces'
import { Logger } from '@utils'

import { getDynamicBlockResponse } from './dynamic-blocks'

const logger = new Logger(`Interaction`)

export const handleInteractionWebhook = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
  logger.debug('handleInteractionWebhook called', { webhook })

  const {
    data: { dynamicBlockKey },
  } = webhook

  if (dynamicBlockKey) {
    return getDynamicBlockResponse(webhook)
  }

  return {
    type: webhook.type,
    status: WebhookStatus.Failed,
    errorCode: ErrorCode.InvalidRequest,
    errorMessage: 'Interaction is not supported.',
  }
}
