import { WebhookStatus, WebhookType } from '@enums'
import {
  EntitiesByContext,
  InteractionWebhook,
  InteractionWebhookResponse,
  ShortcutStatesInput,
  ShortcutStatesResult,
  ShortcutStatesWebhook,
  ShortcutStatesWebhookResponse,
} from '@interfaces'

import { getInteractionNotSupportedError } from '../../error.logics'

import { globalLogger } from '@utils'
import { Shortcut } from './constants'
import {
  getMarkAsFavoriteInteractionResponse,
  getMarkAsFavoriteShortcutStates,
} from './mark-as-favorite'

const logger = globalLogger.setContext(`Shortcut`)

export const getShortcutInteractionResponse = async (
  webhook: InteractionWebhook,
): Promise<InteractionWebhookResponse> => {
  logger.debug('getShortcutResponse called', { webhook })

  const {
    data: { shortcutKey },
  } = webhook

  switch (shortcutKey) {
    case Shortcut.MarkAsFavorite:
      return getMarkAsFavoriteInteractionResponse(webhook)
    default:
      return getInteractionNotSupportedError('shortcutKey', shortcutKey)
  }
}

export const getShortcutStates = async (input: {
  shortcut: string
  data: ShortcutStatesInput
  entitiesByContext: EntitiesByContext
}): Promise<ShortcutStatesResult> => {
  logger.debug('getShortcutStates called', { input })

  const { shortcut, ...options } = input

  switch (shortcut) {
    case Shortcut.MarkAsFavorite:
      return getMarkAsFavoriteShortcutStates(options)
    default:
      return null
  }
}

export const getShortcutStatesResponse = async (
  webhook: ShortcutStatesWebhook,
): Promise<ShortcutStatesWebhookResponse> => {
  logger.debug('getShortcutStateResponse called', { webhook })

  const { data, currentSettings } = webhook
  const { entities } = data
  const shortcuts = [...new Set(entities.map(({ shortcuts }) => shortcuts).flat())]
  const shortcutResults = (
    await Promise.all(
      shortcuts.map(shortcut => {
        const entitiesByContext = entities
          .filter(({ shortcuts }) => shortcuts.includes(shortcut))
          .reduce(
            (preValue, { context, entity }) => ({
              ...preValue,
              [context]: [
                ...(preValue[context] || []),
                {
                  entity,
                  settings: currentSettings.find(
                    cs => cs.context === context && cs.entityId === entity.id,
                  )?.settings,
                },
              ],
            }),
            {} as EntitiesByContext,
          )
        return getShortcutStates({ shortcut, data, entitiesByContext })
      }),
    )
  )
    .filter(promise => Boolean(promise))
    .flat()

  return {
    type: WebhookType.ShortcutsStates,
    status: WebhookStatus.Succeeded,
    data: entities.map(({ context, entity }) => {
      const shortcutStates = shortcutResults
        .filter(
          ({ context: shortcutContext, entityId }) =>
            context === shortcutContext && entityId === entity.id,
        )
        .map(({ shortcutState }) => shortcutState)
      return {
        context,
        entityId: entity.id,
        shortcutStates,
      }
    }),
  }
}
