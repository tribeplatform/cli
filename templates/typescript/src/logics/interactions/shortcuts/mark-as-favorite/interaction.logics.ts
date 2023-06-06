import { InteractionType, WebhookStatus, WebhookType } from '@enums'
import { InteractionWebhook, InteractionWebhookResponse } from '@interfaces'
import { MemberPostSettingsRepository } from '@repositories'
import { PermissionContext } from '@tribeplatform/gql-client/types'

import { getInteractionNotSupportedError } from '../../../error.logics'
import { DynamicBlock } from '../../dynamic-blocks/constants'

import { globalLogger } from '@utils'
import { MarkAsFavoriteState } from './constants'
import { getMarkAsFavoriteState } from './states.logics'

const logger = globalLogger.setContext(`MarkAsFavoriteShortcut`)

export const getMarkAsFavoriteInteractionResponse = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
  logger.debug('getSettingsInteractionResponse called', { webhook })

  const {
    networkId,
    data: { interactionId, actorId },
    context,
    entityId,
  } = webhook

  if (context !== PermissionContext.POST) {
    return getInteractionNotSupportedError('context', context)
  }

  const memberPostSettings = await MemberPostSettingsRepository.findUnique(
    actorId,
    entityId,
  )

  switch (getMarkAsFavoriteState({ memberPostSettings })) {
    case MarkAsFavoriteState.Unmarked:
      await MemberPostSettingsRepository.upsert(actorId, entityId, {
        networkId,
        markedAsFavorite: true,
      })
      break
    case MarkAsFavoriteState.Marked:
      await MemberPostSettingsRepository.upsert(actorId, entityId, {
        networkId,
        markedAsFavorite: false,
      })
      break
    default:
      return getInteractionNotSupportedError('context', context)
  }

  return {
    type: WebhookType.Interaction,
    status: WebhookStatus.Succeeded,
    data: {
      interactions: [
        {
          id: interactionId,
          type: InteractionType.Reload,
          props: {
            context: PermissionContext.POST,
            entityId,
            dynamicBlockKeys: [DynamicBlock.FavoritePosts],
          },
        },
      ],
    },
  }
}
