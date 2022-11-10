import { Flags } from '@oclif/core'
import {
  Action,
  ActionStatus,
  AppPublication,
  StoreItemStatus,
} from '@tribeplatform/gql-client/global-types'
import * as chalk from 'chalk'
import { BetterCommand } from '../../better-command'
import { PUBLIC_PUBLISH_MESSAGE } from '../../constants'
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

    let result: PublishAppResponse
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

      if (appBeforeUpdate.status === StoreItemStatus.PUBLIC) {
        throw new CliError(`App is already published publicly.`)
      }

      this.warn(PUBLIC_PUBLISH_MESSAGE)
      const { confirmed } = await this.prompt<{ confirmed: string }>([
        {
          name: 'confirmed',
          type: 'input',
          message: chalk.reset(
            `Please type ${chalk.bold(appBeforeUpdate.slug)}${chalk.reset(
              ' to confirm',
            )}`,
          ),
        },
      ])

      if (confirmed !== appBeforeUpdate.slug) {
        throw new CliError(`Confirmation failed.`)
      }

      result = await client.mutation({
        name: 'publishApp',
        args: {
          fields: 'basic',
          variables: { id: appId },
        },
      })

      if (result.status !== ActionStatus.succeeded) {
        throw new CliError(`Cannot publish the app right now, please try again later.`)
      }
    } else {
      const networks = await this.getNetworks()
      const appPublications = await client.query({
        name: 'appPublications',
        args: {
          fields: 'basic',
          variables: { appId },
        },
      })
      const availableNetworks = networks.filter(
        network =>
          !appPublications?.find(
            appPublication => appPublication.networkId === network.id,
          ),
      )

      if (networks.length === 0) {
        throw new CliError(`You don't have any networks, please create one first.`)
      }

      if (availableNetworks.length === 0) {
        throw new CliError(`You have already published this app to all your networks.`)
      }

      const input = await this.prompt<{ networkId: string }>([
        {
          name: 'networkId',
          type: 'list',
          default: availableNetworks[0].id,
          message: `Which network do you want to publish to`,
          choices: availableNetworks.map(network => ({
            name: network.domain,
            value: network.id,
          })),
        },
      ])
      networkId = input.networkId

      result = await client.mutation({
        name: 'publishAppPrivately',
        args: {
          fields: 'basic',
          variables: { appId, networkId: networkId as string },
        },
      })
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

    this.logSuccess(`You have successfully published your app!`)

    return result
  }
}
