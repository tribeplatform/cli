import { InteractionWebhook, InteractionWebhookResponse } from '@interfaces'
import { Logger } from '@utils'

import { getInteractionNotSupportedError } from '../../error.logics'

import { getMarkAsFavoriteInteractionResponse } from './mark-as-favorite'

const logger = new Logger(`Shortcut`)

export const getShortcutInteractionResponse = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
  logger.debug('getShortcutResponse called', { webhook })

  const {
    data: { shortcutKey },
  } = webhook

  switch (shortcutKey) {
    case 'mark-as-favorite':
      return getMarkAsFavoriteInteractionResponse(webhook)
    default:
      return getInteractionNotSupportedError('shortcutKey', shortcutKey)
  }
}
