import { InteractionWebhook, InteractionWebhookResponse } from '@interfaces'

import { getInteractionNotSupportedError } from '../error.logics'

import { getSettingsInteractionResponse } from './settings'

export const getInteractionResponse = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
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
