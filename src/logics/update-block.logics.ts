import {
  CreateDynamicBlockInput,
  DefaultDynamicBlockKeys,
} from '@tribeplatform/gql-client/global-types'
import { ListrTask } from 'listr'
import { DynamicBlockConfigs, LocalConfigs } from '../types'
import { CliClient } from '../utils'

export const convertBlockImages = (
  block: DynamicBlockConfigs,
): CreateDynamicBlockInput => {
  const { favicon: faviconId, image: imageId, ...rest } = block
  return {
    ...rest,
    faviconId,
    imageId,
  }
}

export const getUpdateDefaultBlocksTask = (options: {
  client: CliClient
  localConfigs: LocalConfigs
}): ListrTask | undefined => {
  const {
    client,
    localConfigs: { info: { id: appId } = {}, blocks = {} },
  } = options
  const { defaults: defaultBlocks } = blocks

  if (!appId) return

  return {
    title: 'Update default dynamic blocks',
    skip: () => {
      if (defaultBlocks === undefined) {
        return 'No default blocks to update'
      }
    },
    task: async () => {
      await Promise.all(
        Object.values(DefaultDynamicBlockKeys).map(key => {
          const block = defaultBlocks?.find(b => b.key === key)
          if (block) {
            return client.mutation({
              name: 'enableDefaultDynamicBlock',
              args: {
                variables: { appId, key, input: block },
                fields: 'basic',
              },
            })
          }

          return client.mutation({
            name: 'disableDefaultDynamicBlock',
            args: {
              variables: { appId, key },
              fields: 'basic',
            },
          })
        }),
      )
    },
  }
}

export const getUpdateCustomBlocksTask = (options: {
  client: CliClient
  localConfigs: LocalConfigs
}): ListrTask | undefined => {
  const {
    client,
    localConfigs: { info: { id: appId } = {}, blocks = {} },
  } = options
  const { customs: customBlocksWithRelativeImages } = blocks
  const customBlocks = customBlocksWithRelativeImages?.map(convertBlockImages)

  if (!appId) return

  return {
    title: 'Update custom dynamic blocks',
    skip: () => {
      if (blocks === undefined) {
        return 'No custom blocks to update'
      }
    },
    task: async () => {
      const { nodes: currentBlocks } = await client.query({
        name: 'dynamicBlocks',
        args: {
          fields: { nodes: 'basic' },
          variables: { appId, limit: 100 },
        },
      })

      const blockKeys = new Set(currentBlocks?.map(b => b.key))
      const deletedBlocks = currentBlocks?.filter(
        ({ key }) => !customBlocks?.map(b => b.key).includes(key),
      )
      const newBlocks = customBlocks?.filter(({ key }) => key && !blockKeys.has(key))
      const updatedBlocks = customBlocks
        ?.filter(({ key }) => key && blockKeys.has(key))
        .map(block => {
          const currentBlock = currentBlocks?.find(b => b.key === block.key)
          return { id: currentBlock?.id as string, block }
        })

      await Promise.all(
        [
          deletedBlocks?.map(({ id }) =>
            client.mutation({
              name: 'deleteDynamicBlock',
              args: {
                variables: { appId, blockId: id },
                fields: 'basic',
              },
            }),
          ),
          newBlocks?.map(block =>
            client.mutation({
              name: 'createDynamicBlock',
              args: {
                variables: { appId, input: block },
                fields: 'basic',
              },
            }),
          ),
          updatedBlocks?.map(({ id, block }) =>
            client.mutation({
              name: 'updateDynamicBlock',
              args: {
                variables: { appId, blockId: id, input: block },
                fields: 'basic',
              },
            }),
          ),
        ].flat(),
      )
    },
  }
}
