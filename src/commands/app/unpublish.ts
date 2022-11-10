import { Flags } from '@oclif/core'
import {
  Action,
  ActionStatus,
  StoreItemStatus,
} from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../../better-command'
import { getSyncAppTasks } from '../../logics'
import { CliError, NoAppConfigError, UnAuthorizedError } from '../../utils'

type UnPublishAppResponse = Action

export default class UnPublishApp extends BetterCommand<UnPublishAppResponse> {
  static description = 'unpublish app'

  static examples = [
    `$ bettermode app unpublish`,
    `$ bettermode app unpublish --publicly`,
  ]

  static flags = {
    publicly: Flags.boolean({
      char: 'p',
      summary: 'unpublish publicly',
      description:
        'unpublish the app publicly from all networks (except the privately published ones)',
      env: 'BETTERMODE_PUBLISH_PUBLIC',
      required: false,
    }),
  }

  async run(): Promise<UnPublishAppResponse> {
    const {
      flags: { publicly },
    } = await this.parse(UnPublishApp)
    const { dev } = await this.getGlobalFlags()
    const { info: { id: appId } = {} } = await this.getLocalConfigs()
    const client = await this.getClient()
    let networkId: string | undefined

    if (!client) {
      throw new UnAuthorizedError()
    }

    if (!appId) {
      throw new NoAppConfigError()
    }

    let result: UnPublishAppResponse
    if (publicly) {
      const appBeforeUpdate = await client.query({
        name: 'app',
        args: {
          fields: 'basic',
          variables: { id: appId },
        },
      })

      if (!appBeforeUpdate) {
        throw new CliError(`App not found.`)
      }

      if (appBeforeUpdate.status === StoreItemStatus.PRIVATE) {
        throw new CliError(`App is already unpublished.`)
      }

      result = await client.mutation({
        name: 'unpublishApp',
        args: {
          fields: 'basic',
          variables: { id: appId },
        },
      })
    } else {
      const networks = await this.getNetworks()
      const publications = await client.query({
        name: 'appPublications',
        args: { fields: 'basic', variables: { appId } },
      })
      const publishedNetworks = networks.filter(network =>
        publications.find(publication => publication.networkId === network.id),
      )

      if (publishedNetworks.length === 0) {
        throw new UnAuthorizedError(`You didn't publish this app to any network yet.`)
      }

      const input = await this.prompt<{ networkId: string }>([
        {
          name: 'networkId',
          type: 'list',
          default: publishedNetworks[0].id,
          message: `Which network do you want to unpublish from`,
          choices: publishedNetworks.map(network => ({
            name: network.domain,
            value: network.id,
          })),
        },
      ])
      networkId = input.networkId

      result = await client.mutation({
        name: 'unPublishAppPrivately',
        args: {
          fields: 'basic',
          variables: { appId, networkId: networkId as string },
        },
      })
    }

    if (result.status !== ActionStatus.succeeded) {
      throw new CliError(`Cannot unpublish the app right now, please try again later.`)
    }

    const app = await client.query({
      name: 'app',
      args: {
        variables: { id: appId },
        fields: { customCodes: 'all', favicon: 'all', image: 'all' },
      },
    })

    const tasks = getSyncAppTasks({ client, app, dev })
    await tasks.run()

    this.logSuccess(`You have successfully unpublished your app!`)
    return result
  }
}
