import { Flags } from '@oclif/core'
import { App } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../../better-command'
import { getInitAppInputs, getSyncAppTasks } from '../../logics'
import { CliError, UnAuthorizedError } from '../../utils'

type InitAppResponse = App

export default class InitApp extends BetterCommand<InitAppResponse> {
  static description = 'initialize an existing app into the current directory'

  static examples = [`$ bettermode app init --id tj7oAwlJsO61`]

  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'the app id',
      description: 'the id of the app that you want to initialize',
      env: 'BETTERMODE_APP_ID',
      required: false,
    }),
  }

  async run(): Promise<InitAppResponse> {
    const {
      flags: { id, dev },
    } = await this.parse(InitApp)
    let appId = id

    const { info: { id: localAppId } = {} } = await this.getLocalConfigs()
    const client = await this.getClient()

    if (!client) {
      throw new UnAuthorizedError()
    }

    if (localAppId) {
      throw new CliError(`The app config has been already initialized.`)
    }

    const apps = await this.getApps()

    if (apps.length === 0) {
      throw new UnAuthorizedError(`You don't have any apps, please create one first.`)
    }

    if (!appId) {
      const result = await this.prompt(getInitAppInputs(apps))
      appId = result.appId
    }

    const app = apps.find(app => app.id === appId)
    if (!app) {
      throw new Error(`App with id ${appId} not found.`)
    }

    const tasks = getSyncAppTasks({ client, app, dev })
    await tasks.run()

    this.logSuccess(`You have successfully initialized your app's config!`)
    return app
  }
}
