import { Prompter } from '@salesforce/sf-plugins-core'
import { App, DefaultDynamicBlockKeys } from '@tribeplatform/gql-client/global-types'
import * as Listr from 'listr'
import * as ngrok from 'ngrok'
import { CliClient, replaceDomain, Shell } from '../utils'
import { getSyncAppTasks } from './sync-app.logics'

export type NgrokRegion = 'us' | 'eu' | 'au' | 'ap' | 'sa' | 'jp' | 'in'

export type StartAppCLIInputs = {
  subdomain: string
  confirmed: boolean
}

export const getStartAppInputs = (options: {
  app: App
  email: string
  officialPartner?: boolean
}): Prompter.Questions<StartAppCLIInputs> => {
  const { app, email, officialPartner = false } = options
  return [
    {
      name: 'subdomain',
      type: 'input',
      message: `Ngrok's subdomain to start your app on (SUBDOMAIN.ngrok.io)`,
      default: () => {
        if (officialPartner) {
          return `${email?.split('@')[0]}.bettermode`
        }
      },
    },
    {
      name: 'confirmed',
      type: 'confirm',
      message: 'App URLs will be changed. Are you sure?',
      when: ({ subdomain }) => {
        const domain = `${subdomain}.ngrok.io`

        if (app.webhookUrl && !app.webhookUrl.startsWith(`https://${domain}`)) {
          return true
        }

        if (app.interactionUrl && !app.interactionUrl.startsWith(`https://${domain}`)) {
          return true
        }

        if (
          app.federatedSearchUrl &&
          !app.federatedSearchUrl.startsWith(`https://${domain}`)
        ) {
          return true
        }

        return false
      },
    },
  ]
}

export const getStartAppTasks = (options: {
  dev: boolean
  client: CliClient
  subdomain: string | undefined
  app: App
  ngrokToken: string | undefined
  ngrokRegion: NgrokRegion | undefined
}): Listr<{ url: string; domain: string; app: App }> => {
  const { dev, client, subdomain, app, ngrokToken, ngrokRegion } = options

  return new Listr([
    {
      title: 'Run ngrok',
      task: async ctx => {
        ctx.url = await ngrok.connect({
          subdomain,
          authtoken: ngrokToken,
          region: ngrokRegion,
        })
        ctx.domain = ctx.url.replace('https://', '')
      },
    },
    {
      title: `Update app's configs`,
      task: async ctx => {
        const { domain } = ctx

        try {
          ctx.app = await client.mutation({
            name: 'updateApp',
            args: {
              fields: { image: 'all', favicon: 'all', customCodes: 'all' },
              variables: {
                id: app.id,
                input: {
                  webhookUrl: replaceDomain(app.webhookUrl || undefined, domain),
                  interactionUrl: replaceDomain(app.interactionUrl || undefined, domain),
                  federatedSearchUrl: replaceDomain(
                    app.federatedSearchUrl || undefined,
                    domain,
                  ),
                },
              },
            },
          })

          const { nodes: blocksNodes } = await client.query({
            name: 'dynamicBlocks',
            args: {
              fields: { nodes: 'basic' },
              variables: { appId: app.id, limit: 100 },
            },
          })
          const blocks = blocksNodes || []

          const { nodes: shortcutsNodes } = await client.query({
            name: 'shortcuts',
            args: {
              fields: 'basic',
              variables: { appId: app.id, limit: 100 },
            },
          })
          const shortcuts = shortcutsNodes || []

          await Promise.all([
            ...blocks
              .filter(block => block.interactionUrl)
              .filter(block =>
                Object.values(DefaultDynamicBlockKeys).includes(
                  block.key as unknown as DefaultDynamicBlockKeys,
                ),
              )
              .map(block =>
                client.mutation({
                  name: 'enableDefaultDynamicBlock',
                  args: {
                    fields: 'basic',
                    variables: {
                      appId: app.id,
                      key: block.key as unknown as DefaultDynamicBlockKeys,
                      input: {
                        interactionUrl: replaceDomain(
                          block.interactionUrl || undefined,
                          domain,
                        ),
                      },
                    },
                  },
                }),
              ),
            ...blocks
              .filter(block => block.interactionUrl)
              .filter(
                block =>
                  !Object.values(DefaultDynamicBlockKeys).includes(
                    block.key as unknown as DefaultDynamicBlockKeys,
                  ),
              )
              .map(block =>
                client.mutation({
                  name: 'updateDynamicBlock',
                  args: {
                    fields: 'basic',
                    variables: {
                      appId: app.id,
                      blockId: block.id,
                      input: {
                        interactionUrl: replaceDomain(
                          block.interactionUrl || undefined,
                          domain,
                        ),
                      },
                    },
                  },
                }),
              ),
            ...shortcuts
              .filter(shortcut => shortcut.interactionUrl)
              .map(shortcut =>
                client.mutation({
                  name: 'updateShortcut',
                  args: {
                    fields: 'basic',
                    variables: {
                      appId: app.id,
                      id: shortcut.id,
                      input: {
                        interactionUrl: replaceDomain(
                          shortcut.interactionUrl || undefined,
                          domain,
                        ),
                      },
                    },
                  },
                }),
              ),
          ])
        } catch (error) {
          await ngrok.kill()
          throw error
        }
      },
    },
    {
      title: 'Sync app configs',
      task: ctx => getSyncAppTasks({ client, app: ctx.app, dev }) as Listr,
    },
    {
      title: 'Run app in docker mode',
      task: async () => {
        try {
          await Shell.exec(`yarn docker:up`)
        } catch (error) {
          await ngrok.kill()
          throw error
        }
      },
    },
  ])
}
