import { Flags } from '@oclif/core'
import { App } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../../better-command'
import { getInitAppTasks } from '../../logics'
import { UnAuthorizedError } from '../../utils'

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

    const client = await this.getClient()
    const apps = await this.getApps()

    if (!client) {
      throw new UnAuthorizedError()
    }

    if (apps.length === 0) {
      throw new UnAuthorizedError(`You don't have any apps, please create one first.`)
    }

    if (!appId) {
      const result = await this.prompt<{ appId: string }>([
        {
          name: 'appId',
          type: 'list',
          default: apps[0].id,
          message: `Please select a app for your app:`,
          choices: apps.map(app => ({
            name: app.name,
            value: app.id,
          })),
        },
      ])
      appId = result.appId
    }

    const app = apps.find(app => app.id === appId)
    if (!app) {
      throw new Error(`App with id ${appId} not found.`)
    }

    const tasks = getInitAppTasks({
      client,
      app,
      dev,
    })
    await tasks.run()

    this.logSuccess('You have successfully initialized your app!')
    return app
  }
}