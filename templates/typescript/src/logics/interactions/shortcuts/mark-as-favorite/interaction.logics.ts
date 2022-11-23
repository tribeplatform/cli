import { InteractionType, WebhookStatus, WebhookType } from '@enums'
import { InteractionWebhook, InteractionWebhookResponse } from '@interfaces'
import { MemberPostSettingsRepository } from '@repositories'
import { PermissionContext } from '@tribeplatform/gql-client/types'
import { Logger } from '@utils'

import { getInteractionNotSupportedError } from '../../../error.logics'

const logger = new Logger(`MarkAsFavoriteShortcut`)

export const getMarkAsFavoriteInteractionResponse = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
  logger.debug('getSettingsInteractionResponse called', { webhook })

  const {
    networkId,
    data: { interactionId, shortcutState, actorId },
    context,
    entityId,
  } = webhook

  if (context !== PermissionContext.POST) {
    return getInteractionNotSupportedError('context', context)
  }

  switch (shortcutState) {
    case 'unmarked':
      await MemberPostSettingsRepository.upsert(actorId, entityId, {
        networkId,
        markedAsFavorite: true,
      })
      return {
        type: WebhookType.Interaction,
        status: WebhookStatus.Succeeded,
        data: {
          interactions: [
            {
              id: interactionId,
              type: InteractionType.Reload,
              props: {
                entity: PermissionContext.POST,
              },
            },
          ],
        },
      }
    case 'marked':
      await MemberPostSettingsRepository.upsert(actorId, entityId, {
        networkId,
        markedAsFavorite: false,
      })
      return {
        type: WebhookType.Interaction,
        status: WebhookStatus.Succeeded,
        data: {
          interactions: [
            {
              id: interactionId,
              type: InteractionType.Reload,
              props: {
                entity: PermissionContext.POST,
              },
            },
          ],
        },
      }
    default:
      return getInteractionNotSupportedError('context', context)
  }
}
