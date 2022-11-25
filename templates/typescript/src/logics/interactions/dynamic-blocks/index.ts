import { InteractionWebhook, InteractionWebhookResponse } from '@interfaces'
import { Logger } from '@utils'

import { getInteractionNotSupportedError } from '../../error.logics'

import { DynamicBlock } from './constants'
import { getFavoritePostsInteractionResponse } from './favorite-posts'
import { getSettingsInteractionResponse } from './settings'

const logger = new Logger(`DynamicBlock`)

export const getDynamicBlockInteractionResponse = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
  logger.debug('getDynamicBlockResponse called', { webhook })

  const {
    data: { dynamicBlockKey },
  } = webhook

  switch (dynamicBlockKey) {
    case DynamicBlock.Settings:
      return getSettingsInteractionResponse(webhook)
    case DynamicBlock.FavoritePosts:
      return getFavoritePostsInteractionResponse(webhook)
    default:
      return getInteractionNotSupportedError('dynamicBlockKey', dynamicBlockKey)
  }
}
