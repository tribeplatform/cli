import { EntitiesByContext, ShortcutStatesInput, ShortcutStatesResult } from '@interfaces'
import { MemberPostSettings } from '@prisma/client'
import { MemberPostSettingsRepository } from '@repositories'
import { PermissionContext, RoleType } from '@tribeplatform/gql-client/types'

import { Shortcut } from '../constants'

import { globalLogger } from '@utils'
import { MarkAsFavoriteState } from './constants'

const logger = globalLogger.setContext(`MarkAsFavoriteShortcut`)

export const getMarkAsFavoriteState = (options: {
  memberPostSettings: MemberPostSettings
}): MarkAsFavoriteState => {
  const { memberPostSettings } = options

  return memberPostSettings?.markedAsFavorite
    ? MarkAsFavoriteState.Marked
    : MarkAsFavoriteState.Unmarked
}

export const getMarkAsFavoriteShortcutStates = async (options: {
  data: ShortcutStatesInput
  entitiesByContext: EntitiesByContext
}): Promise<ShortcutStatesResult> => {
  logger.debug('getMarkAsFavoriteShortcutStates called', { options })

  const {
    data: { member, role },
    entitiesByContext,
  } = options

  if (role.type === RoleType.guest) return []

  const postIds = entitiesByContext.POST?.map(({ entity }) => entity.id) ?? []
  const settings = await MemberPostSettingsRepository.findMany({
    where: {
      memberId: member.id,
      postId: { in: postIds },
    },
  })
  return postIds.map(postId => ({
    context: PermissionContext.POST,
    entityId: postId,
    shortcutState: {
      shortcut: Shortcut.MarkAsFavorite,
      state: getMarkAsFavoriteState({
        memberPostSettings: settings.find(setting => setting.postId === postId),
      }),
    },
  }))
}
