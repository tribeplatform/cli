import { App, UpdateAppInput } from '@tribeplatform/gql-client/global-types'
import * as Listr from 'listr'
import { AppInfo, LocalConfigs } from '../types'
import { CliClient } from '../utils'
import { convertBlockImages, convertShortcutImages } from './configs-converter.logics'
import { getImageId } from './image.logics'

export const convertAppImages = (shortcut: Omit<AppInfo, 'id'>): UpdateAppInput => {
  const { favicon, image, ...rest } = shortcut
  return {
    ...rest,
    faviconId: getImageId(favicon),
    imageId: getImageId(image),
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
    collaborators,
    shortcuts: shortcutsWithRelativeImages,
    blocks: { defaults: defaultBlocks, customs: customBlocks } = {},
  } = localConfigs
  const info = convertAppImages(infoWithRelativeImages as Omit<AppInfo, 'id'>)
  const shortcuts =
    shortcutsWithRelativeImages?.map(shortcut => convertShortcutImages(shortcut)) || []
  const dynamicBlocks = [
    ...(defaultBlocks || []),
    ...(customBlocks || []).map(block => convertBlockImages(block)),
  ]

  let customCodes: LocalConfigs['customCodes'] | null = null
  if (customCodesConfig?.head || customCodesConfig?.body) {
    customCodes = customCodesConfig
  }

  return new Listr(
    [
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
                  collaborators,
                  shortcuts,
                  dynamicBlocks,
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
    ],
    { concurrent: true },
  )
}
