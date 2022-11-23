import { InteractionWebhook, InteractionWebhookResponse } from '@interfaces'
import { Logger } from '@utils'

import { getInteractionNotSupportedError } from '../../error.logics'

import { getSettingsInteractionResponse } from './settings'

const logger = new Logger(`DynamicBlock`)

export const getDynamicBlockResponse = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
  logger.debug('getDynamicBlockResponse called', { webhook })

  const {
    data: { dynamicBlockKey },
  } = webhook

  switch (dynamicBlockKey) {
    case 'settings':
      return getSettingsInteractionResponse(webhook)
    default:
      return getInteractionNotSupportedError('dynamicBlockKey', dynamicBlockKey)
  }
}
