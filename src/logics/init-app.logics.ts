import {
  App,
  AppCollaborator,
  DynamicBlock,
  Image,
  Shortcut,
} from '@tribeplatform/gql-client/global-types'
import * as Listr from 'listr'
import { RC_DEV_POSTFIX, RC_FILE_NAME } from '../constants'
import { CliClient, CliError, setLocalConfigs, Shell } from '../utils'

export const getInitAppTasks = (options: {
  client: CliClient
  app: App
  dev: boolean
}) => {
  const { client, app, dev } = options

  const fileName = `${RC_FILE_NAME}${dev ? RC_DEV_POSTFIX : ''}`
  const files = Shell.find([fileName], { silent: true })
  if (files.length > 0) {
    throw new CliError(`The file \`${fileName}\` already exists.`)
  }

  return new Listr([
    {
      title: `Getting app info`,
      task: ctx =>
        new Listr(
          [
            {
              title: 'Getting collaborators',
              task: async ctx => {
                ctx.collaborators = await client.query({
                  name: 'appCollaborators',
                  args: {
                    fields: 'basic',
                    variables: { appId: app.id },
                  },
                })
              },
            },
            {
              title: 'Getting shortcuts',
              task: async ctx => {
                // const result = await client.query({
                //   name: 'shortcuts',
                //   args: {
                //     fields: { nodes: { favicon: 'all', states: 'all' } },
                //     variables: { appId: app.id, limit: 100 },
                //   },
                // })
                ctx.shortcuts = []
              },
            },
            {
              title: 'Getting dynamic blocks',
              task: async () => {
                const result = await client.query({
                  name: 'dynamicBlocks',
                  args: {
                    fields: { nodes: { favicon: 'all', image: 'all' } },
                    variables: { appId: app.id, limit: 100 },
                  },
                })
                ctx.blocks = result.nodes || []
              },
            },
          ],
          { concurrent: true },
        ),
    },
    {
      title: 'Finalizing config file',
      task: async ctx => {
        const collaborators: AppCollaborator[] = ctx.collaborators
        const shortcuts: Shortcut[] = ctx.shortcuts
        const blocks: DynamicBlock[] = ctx.blocks

        return setLocalConfigs(
          {
            id: app.id,
            name: app.name,
            slug: app.slug,
            status: app.status,
            standing: app.standing,

            description: app.description || undefined,
            image: (app.image as Image)?.url,
            favicon: (app.favicon as Image)?.url,

            webhookUrl: app.webhookUrl || undefined,
            // federatedSearchUrl: app.federatedSearchUrl || undefined,
            // interactionUrl: app.interactionUrl || undefined,
            // redirectUris: app.redirectUris || undefined,

            collaborators: collaborators.map(c => c.email),
            webhookSubscriptions: app.webhookSubscriptions || undefined,
            customCodes: app.customCodes
              ? {
                  head: app.customCodes?.head || undefined,
                  body: app.customCodes?.body || undefined,
                }
              : undefined,

            shortcuts: shortcuts.map(shortcut => ({
              context: shortcut.context,
              entityType: shortcut.entityType || undefined,

              name: shortcut.name,
              description: shortcut.description || undefined,
              favicon: (shortcut.favicon as Image)?.url,

              callbackId: shortcut.callbackId,
              callbackUrl: shortcut.callbackUrl || undefined,
              states: shortcut.states?.map(shortcutState => ({
                state: shortcutState.state,
                condition: shortcutState.condition,

                name: shortcutState.name || undefined,
                description: shortcutState.description || undefined,
                favicon: (shortcutState.favicon as Image)?.url,
              })),
            })),
            blocks: blocks.map(block => ({
              contexts: block.contexts || undefined,

              slug: block.slug,
              name: block.name,
              description: block.description || undefined,
              favicon: (block.favicon as Image)?.url,
              image: (block.image as Image)?.url,

              callbackUrl: block.callbackUrl || undefined,
              settings: block.settings || undefined,
            })),
          },
          { dev },
        )
      },
    },
  ])
}
