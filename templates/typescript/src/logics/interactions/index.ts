import { ErrorCode, WebhookStatus } from '@enums'
import { InteractionWebhook, InteractionWebhookResponse } from '@interfaces'
import { Logger } from '@utils'

import { getDynamicBlockInteractionResponse } from './dynamic-blocks'
import { getShortcutInteractionResponse } from './shortcuts'

const logger = new Logger(`Interaction`)

export const handleInteractionWebhook = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
  logger.debug('handleInteractionWebhook called', { webhook })

  const {
    data: { dynamicBlockKey, shortcutKey },
  } = webhook

  if (dynamicBlockKey) {
    return getDynamicBlockInteractionResponse(webhook)
  } else if (shortcutKey) {
    return getShortcutInteractionResponse(webhook)
  }

  return {
    type: webhook.type,
    status: WebhookStatus.Failed,
    errorCode: ErrorCode.InvalidRequest,
    errorMessage: 'Interaction is not supported.',
  }
}
