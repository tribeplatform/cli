import { App, UpdateAppInput } from '@tribeplatform/gql-client/global-types'
import * as Listr from 'listr'
import { AppInfo, LocalConfigs } from '../types'
import { CliClient } from '../utils'
import {
  getUpdateCustomBlocksTask,
  getUpdateDefaultBlocksTask,
} from './update-block.logics'
import { getUpdateCollaboratorsTasks } from './update-collaborators.logics'
import { getUpdateShortcutTask } from './update-shortcut.logics'

export const convertAppImages = (shortcut: Omit<AppInfo, 'id'>): UpdateAppInput => {
  const { favicon: faviconId, image: imageId, ...rest } = shortcut
  return {
    ...rest,
    faviconId,
    imageId,
  }
}

export const getUpdateAppTasks = (options: {
  client: CliClient
  localConfigs: LocalConfigs
  officialPartner: boolean
}): Listr<{ app: App }> => {
  const { client, localConfigs, officialPartner } = options
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info: { id: appId, status, standing, ...infoWithRelativeImages } = {},
    configs,
    customCodes: customCodesConfig,
  } = localConfigs
  const info = convertAppImages(infoWithRelativeImages as Omit<AppInfo, 'id'>)

  let customCodes: LocalConfigs['customCodes'] | null = null
  if (customCodesConfig?.head || customCodesConfig?.body) {
    customCodes = customCodesConfig
  }

  const tasks: Listr.ListrTask<{ app: App }>[] = [
    {
      title: 'Update app info',
      task: async (ctx: { app: App }) => {
        ctx.app = await client.mutation({
          name: 'updateApp',
          args: {
            variables: {
              id: appId as string,
              input: {
                ...info,
                ...configs,
                customCodes,
                standing: officialPartner ? standing : undefined,
              },
            },
            fields: {
              customCodes: 'all',
              favicon: 'all',
              image: 'all',
            },
          },
        })
      },
    },
    getUpdateCollaboratorsTasks({ client, localConfigs }),
    getUpdateShortcutTask({ client, localConfigs }),
    getUpdateDefaultBlocksTask({ client, localConfigs }),
    getUpdateCustomBlocksTask({ client, localConfigs }),
  ].filter(task => task !== undefined) as Listr.ListrTask<{ app: App }>[]

  return new Listr(tasks, { concurrent: true })
}
