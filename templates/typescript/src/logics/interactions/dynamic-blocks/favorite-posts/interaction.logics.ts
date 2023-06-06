import { InteractionType, WebhookStatus, WebhookType } from '@enums'
import { InteractionWebhook, InteractionWebhookResponse } from '@interfaces'
import { MemberPostSettingsRepository } from '@repositories'
import { SlateDto } from '@tribeplatform/slate-kit/dtos'

import { globalLogger } from '@utils'
import { NUMBER_OF_POSTS_TO_SHOW } from './constants'
import { getEmptyFavoritePostsSlate, getFavoritePostsSlate } from './slate.logics'

const logger = globalLogger.setContext(`FavoritePostsDynamicBlock`)

export const getFavoritePostsInteractionResponse = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
  logger.debug('getSettingsInteractionResponse called', { webhook })

  const {
    data: { actorId, interactionId, callbackId },
  } = webhook

  const take = callbackId
    ? Number(callbackId.replace('show-more-', ''))
    : NUMBER_OF_POSTS_TO_SHOW
  const favoritePosts = await MemberPostSettingsRepository.findMany({
    where: {
      memberId: actorId,
      markedAsFavorite: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: take + 1,
  })

  let slate: SlateDto
  if (favoritePosts.length > 0) {
    slate = await getFavoritePostsSlate({
      postIds: favoritePosts.map(favoritePost => favoritePost.postId).slice(0, take),
      take: take + NUMBER_OF_POSTS_TO_SHOW,
      showMore: favoritePosts.length > take,
    })
  } else {
    slate = await getEmptyFavoritePostsSlate()
  }

  return {
    type: WebhookType.Interaction,
    status: WebhookStatus.Succeeded,
    data: {
      interactions: [
        {
          id: interactionId,
          type: InteractionType.Show,
          slate,
        },
      ],
    },
  }
}
