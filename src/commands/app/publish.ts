import { Flags } from '@oclif/core'
import {
  Action,
  ActionStatus,
  AppPublication,
} from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../../better-command'
import { getSyncAppTasks } from '../../logics'
import { CliError, NoAppConfigError, UnAuthorizedError } from '../../utils'

type PublishAppResponse = AppPublication | Action

export default class PublishApp extends BetterCommand<PublishAppResponse> {
  static description = 'publish app'

  static examples = [`$ bettermode app publish`, `$ bettermode app publish --publicly`]

  static flags = {
    publicly: Flags.boolean({
      char: 'p',
      summary: 'publish publicly',
      description: 'publish the app publicly for all networks',
      env: 'BETTERMODE_PUBLISH_PUBLIC',
      required: false,
    }),
  }

  async run(): Promise<PublishAppResponse> {
    const {
      flags: { publicly },
    } = await this.parse(PublishApp)
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

    if (!publicly) {
      const networks = await this.getNetworks()

      if (networks.length === 0) {
        throw new UnAuthorizedError(
          `You don't have any networks, please create one first.`,
        )
      }

      const result = await this.prompt<{ networkId: string }>([
        {
          name: 'networkId',
          type: 'list',
          default: networks[0].id,
          message: `Which network do you want to publish to`,
          choices: networks.map(network => ({
            name: network.domain,
            value: network.id,
          })),
        },
      ])
      networkId = result.networkId
    }

    const result = await this.runWithSpinner<Action | AppPublication>(
      'Publishing your app',
      () => {
        if (publicly) {
          return client.mutation({
            name: 'publishApp',
            args: {
              fields: 'basic',
              variables: { id: appId },
            },
          })
        }

        return client.mutation({
          name: 'publishAppPrivately',
          args: {
            fields: 'basic',
            variables: { appId, networkId: networkId as string },
          },
        })
      },
    )

    if (
      (result as Action)?.status === ActionStatus.succeeded ||
      (result as AppPublication)?.id
    ) {
      const app = await client.query({
        name: 'app',
        args: {
          variables: { id: appId },
          fields: { customCodes: 'all', favicon: 'all', image: 'all' },
        },
      })

      const tasks = getSyncAppTasks({ client, app, dev })
      await tasks.run()

      this.logSuccess(`You have successfully published your app!`)
    } else {
      throw new CliError(`Cannot publish the app right now, please try again later.`)
    }

    return result
  }
}
