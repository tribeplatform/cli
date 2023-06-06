import { SlateDto } from '@tribeplatform/slate-kit/dtos'
import { rawSlateToDto } from '@tribeplatform/slate-kit/utils'

import { globalLogger } from '@utils'
import { EMPTY_FAVORITE_POSTS_SLATE } from './slates/empty-favorite-posts.slate'
import { FAVORITE_POSTS_SLATE } from './slates/favorite-posts.slate'

const logger = globalLogger.setContext(`FavoritePostsDynamicBlock`)

export const getFavoritePostsSlate = async (options: {
  postIds: string[]
  take: number
  showMore: boolean
}): Promise<SlateDto> => {
  logger.debug('getFavoritePostsSlate called', { options })

  const rawSlate = FAVORITE_POSTS_SLATE(options)
  return rawSlateToDto(rawSlate)
}

export const getEmptyFavoritePostsSlate = async (): Promise<SlateDto> => {
  logger.debug('getEmptyFavoritePostsSlate called')

  return rawSlateToDto(EMPTY_FAVORITE_POSTS_SLATE)
}
