import { CreateShortcutInput } from '@tribeplatform/gql-client/global-types'
import { ListrTask } from 'listr'
import { LocalConfigs, ShortcutConfigs } from '../types'
import { CliClient } from '../utils'

export const convertShortcutImages = (shortcut: ShortcutConfigs): CreateShortcutInput => {
  const { favicon: faviconId, states, ...rest } = shortcut
  return {
    ...rest,
    faviconId,
    states: states?.map(state => {
      const { favicon: faviconId, ...rest } = state
      return {
        ...rest,
        faviconId,
      }
    }),
  }
}

export const getUpdateShortcutTask = (options: {
  client: CliClient
  localConfigs: LocalConfigs
}): ListrTask => {
  const {
    client,
    localConfigs: { info: { id } = {}, shortcuts: shortcutsWithRelativeImages },
  } = options
  const appId = id as string
  const shortcuts = shortcutsWithRelativeImages?.map(convertShortcutImages)

  return {
    title: 'Update shortcuts',
    skip: () => {
      if (shortcuts === undefined) {
        return 'No shortcuts to update'
      }
    },
    task: async () => {
      const { nodes: currentShortcuts } = await client.query({
        name: 'shortcuts',
        args: {
          fields: { nodes: 'basic' },
          variables: { appId, limit: 100 },
        },
      })

      const shortcutKeys = new Set(currentShortcuts?.map(s => s.key))
      const deletedShortcuts = currentShortcuts?.filter(
        ({ key }) => !shortcuts?.map(s => s.key).includes(key),
      )
      const newShortcuts = shortcuts?.filter(({ key }) => key && !shortcutKeys.has(key))
      const updatedShortcuts = shortcuts
        ?.filter(({ key }) => key && shortcutKeys.has(key))
        .map(shortcut => {
          const currentShortcut = currentShortcuts?.find(s => s.key === shortcut.key)
          return { id: currentShortcut?.id as string, shortcut }
        })

      await Promise.all(
        [
          deletedShortcuts?.map(({ id }) =>
            client.mutation({
              name: 'deleteShortcut',
              args: {
                variables: { appId, id },
                fields: 'basic',
              },
            }),
          ),
          newShortcuts?.map(shortcut =>
            client.mutation({
              name: 'createShortcut',
              args: {
                variables: { appId, input: shortcut },
                fields: 'basic',
              },
            }),
          ),
          updatedShortcuts?.map(({ id, shortcut }) =>
            client.mutation({
              name: 'updateShortcut',
              args: {
                variables: { appId, id, input: shortcut },
                fields: 'basic',
              },
            }),
          ),
        ].flat(),
      )
    },
  }
}
