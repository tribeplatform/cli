import { App } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../../better-command'
import { getSyncAppTasks } from '../../logics'
import { NoAppConfigError, UnAuthorizedError } from '../../utils'

type SyncAppResponse = App

export default class SyncApp extends BetterCommand<SyncAppResponse> {
  static description = 'sync app configs'

  static examples = [`$ bettermode app sync`]

  async run(): Promise<SyncAppResponse> {
    const { dev } = await this.getGlobalFlags()
    const { id } = await this.getLocalConfigs()
    const client = await this.getClient()

    if (!client) {
      throw new UnAuthorizedError()
    }

    if (!id) {
      throw new NoAppConfigError()
    }

    const app = await client.query({
      name: 'app',
      args: {
        variables: { id },
        fields: { customCodes: 'all', favicon: 'all', image: 'all' },
      },
    })
    if (!app) {
      throw new Error(`App with id ${id} not found.`)
    }

    const tasks = getSyncAppTasks({ client, app, dev, errorOnExisting: false })
    await tasks.run()

    this.logSuccess(`You have successfully synced your app's config!`)
    return app
  }
}
