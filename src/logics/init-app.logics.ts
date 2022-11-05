import { Prompter } from '@salesforce/sf-plugins-core'
import {
  App,
  AppCollaborator,
  DynamicBlock,
  Shortcut,
} from '@tribeplatform/gql-client/global-types'

import * as Listr from 'listr'
import {
  CliClient,
  CliError,
  getLocalConfigFileRelativePath,
  setLocalConfigs,
  Shell,
} from '../utils'
import {
  appConfigsConverter,
  blocksConfigsConverter,
  shortcutsConfigsConverter,
} from './configs-converter.logics'

export type InitAppCLIInputs = {
  appId: string
}

export const getInitAppInputs = (apps: App[]): Prompter.Questions<InitAppCLIInputs> => [
  {
    name: 'appId',
    type: 'list',
    default: apps[0].id,
    message: `Which app do you want to initialize`,
    choices: apps.map(app => ({
      name: app.name,
      value: app.id,
    })),
  },
]

export const getInitAppTasks = (options: {
  client: CliClient
  app: App
  dev: boolean
}) => {
  const { client, app, dev } = options

  const fileName = getLocalConfigFileRelativePath(dev)
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
                const result = await client.query({
                  name: 'shortcuts',
                  args: {
                    fields: { nodes: { favicon: 'all', states: 'all' } },
                    variables: { appId: app.id, limit: 100 },
                  },
                })
                ctx.shortcuts = result.nodes || []
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
      title: 'Creating config folder',
      task: async ctx => {
        const collaborators: AppCollaborator[] = ctx.collaborators
        const shortcuts: Shortcut[] = ctx.shortcuts
        const blocks: DynamicBlock[] = ctx.blocks

        return setLocalConfigs(
          {
            ...appConfigsConverter(app, collaborators),
            ...blocksConfigsConverter(blocks),
            ...shortcutsConfigsConverter(shortcuts),
          },
          { dev },
        )
      },
    },
  ])
}
