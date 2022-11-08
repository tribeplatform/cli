import { Flags } from '@oclif/core'
import { StoreItemStatus } from '@tribeplatform/gql-client/global-types'
import * as ngrok from 'ngrok'
import { BetterCommand } from '../../better-command'
import { getStartAppInputs, getStartAppTasks } from '../../logics'
import { NoAppConfigError, Shell, UnAuthorizedError } from '../../utils'

type StartAppResponse = Record<string, never>

export default class StartApp extends BetterCommand<StartAppResponse> {
  static description = 'start app with ngrok'

  static examples = [
    `$ bettermode app start`,
    `$ bettermode app start --sub-domain my-sub-domain`,
  ]

  static flags = {
    'sub-domain': Flags.string({
      char: 's',
      summary: 'your ngrok sub domain',
      description: 'the ngrok sub domain that you want to use to start the tunnel',
      env: 'BETTERMODE_NGROK_SUB_DOMAIN',
      required: false,
    }),
  }

  async run(): Promise<StartAppResponse> {
    const {
      flags: { 'sub-domain': inputSubdomain },
    } = await this.parse(StartApp)
    const { dev } = await this.getGlobalFlags()
    const { ngrokToken, email, officialPartner } = await this.getGlobalConfigs()
    const { info: { id } = {} } = await this.getLocalConfigs()
    const client = await this.getClient()

    let subdomain = inputSubdomain

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

    if (app.status === StoreItemStatus.PUBLIC) {
      throw new Error('You can not start a public app since the URLs will be changed.')
    }

    if (!inputSubdomain && ngrokToken) {
      const { subdomain: promptSubdomain, confirmed } = await this.prompt(
        getStartAppInputs({ app, email: email as string, officialPartner }),
      )
      if (confirmed === false) {
        throw new Error(`You must confirm in order to proceed.`)
      }

      subdomain = promptSubdomain
    }

    const tasks = getStartAppTasks({
      client,
      app,
      dev,
      subdomain,
      ngrokToken,
      ngrokRegion: 'us',
    })
    const { url } = await tasks.run()

    try {
      await Shell.open(url, { silent: true })
      this.logSuccess(`The app has been started successfully on ${url}`)
      await Shell.execAndBindStdout(`yarn docker:logs server`)
    } catch (error) {
      await ngrok.kill()
      throw error
    }

    return {}
  }
}
