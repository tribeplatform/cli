import { App } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../../better-command'
import {
  getCreateAppInputs,
  getCreateAppTasks,
  removeCreateAppTargetDirs,
} from '../../logics'
import { getBettermodeTypeface, UnAuthorizedError } from '../../utils'

type CreateAppResponse = App

export default class CreateApp extends BetterCommand<CreateAppResponse> {
  static description = 'create a new app'

  static examples = [`$ bettermode app create`]

  async run(): Promise<CreateAppResponse> {
    const typeface = await getBettermodeTypeface()
    this.log(typeface || '')
    this.log(`Let's create your next amazing app!\n\n`)

    const { dev } = await this.getGlobalFlags()
    const { officialPartner } = await this.getGlobalConfigs()
    const client = await this.getClient()
    const networks = await this.getNetworks()
    const githubUser = await this.getGithubUser()

    if (!client) {
      throw new UnAuthorizedError()
    }

    if (networks.length === 0) {
      throw new UnAuthorizedError(`You don't have any networks, please create one first.`)
    }

    const input = await this.prompt(
      getCreateAppInputs({ networks, officialPartner, githubUser }),
    )

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
