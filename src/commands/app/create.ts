import { App } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../../better-command'
import {
  getCreateAppInputs,
  getCreateAppTasks,
  removeCreateAppTargetDirs,
} from '../../logics'
import { UnAuthorizedError } from '../../utils'

type CreateAppResponse = App

export default class CreateApp extends BetterCommand<CreateAppResponse> {
  static description = 'create a new app'

  static examples = [`$ bettermode app create`]

  async run(): Promise<CreateAppResponse> {
    const { dev } = await this.getGlobalFlags()
    const { officialPartner } = await this.getGlobalConfigs()
    const client = await this.getClient()
    const networks = await this.getNetworks()

    if (!client) {
      throw new UnAuthorizedError()
    }

    if (networks.length === 0) {
      throw new UnAuthorizedError(`You don't have any networks, please create one first.`)
    }

    const input = await this.prompt(getCreateAppInputs({ networks, officialPartner }))

    const tasks = getCreateAppTasks({
      dev,
      client,
      officialPartner,
      input,
    })

    let app: App
    try {
      const ctx = await tasks.run()
      app = ctx?.app as App
      if (!app) {
        throw new Error('App creation failed')
      }
    } catch (error) {
      removeCreateAppTargetDirs(input)
      throw error
    }

    this.logSuccess('You have successfully created an app!')
    return app
  }
}
