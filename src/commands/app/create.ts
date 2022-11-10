import { App, Network } from '@tribeplatform/gql-client/global-types'

import { BetterCommand } from '../../better-command'
import { TYPEFACE } from '../../constants'
import {
  getCreateAppInputs,
  getCreateAppTasks,
  removeCreateAppTargetDirs,
} from '../../logics'
import { CliClient, UnAuthorizedError } from '../../utils'

type CreateAppResponse = App

export default class CreateApp extends BetterCommand<CreateAppResponse> {
  static description = 'create a new app'

  static examples = [`$ bettermode app create`]

  async run(): Promise<CreateAppResponse> {
    const { dev } = await this.getGlobalFlags()
    const { officialPartner } = await this.getGlobalConfigs()

    const client = await this.getClient(false)
    const networks = await this.getNetworks(false)

    let devClient: CliClient | null = null
    let devNetworks: Network[] = []
    if (dev) {
      devClient = await this.getClient(true)
      devNetworks = await this.getNetworks(true)
    }

    const githubUser = await this.getGithubUser()

    if (!client || (dev && !devClient)) {
      this.log(`${!client} - ${!devClient}`)
      throw new UnAuthorizedError()
    }

    if (networks.length === 0 || (dev && devNetworks.length === 0)) {
      throw new UnAuthorizedError(`You don't have any networks, please create one first.`)
    }

    this.log(TYPEFACE)
    this.log(`Let's create your next amazing app!\n\n`)

    const input = await this.prompt(
      getCreateAppInputs({ networks, devNetworks, officialPartner, githubUser }),
    )

    const tasks = getCreateAppTasks({
      dev,
      client,
      devClient,
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
