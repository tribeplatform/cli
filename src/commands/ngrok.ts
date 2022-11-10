import { Flags } from '@oclif/core'
import * as ngrok from 'ngrok'
import { BetterCommand } from '../better-command'

type SetupNgrokResponse = {}

export default class SetupNgrok extends BetterCommand<SetupNgrokResponse> {
  static description = 'setup your ngrok account'

  static examples = [
    `$ bettermode ngrok`,
    `$ bettermode ngrok --auth-token=your-auth-token`,
  ]

  static flags = {
    'auth-token': Flags.string({
      char: 'a',
      summary: 'your ngrok auth token',
      description: 'the ngrok auth token that you want to use to start the tunnel',
      env: 'BETTERMODE_NGROK_AUTH_TOKEN',
      required: false,
    }),
  }

  async run(): Promise<SetupNgrokResponse> {
    const {
      flags: { 'auth-token': inputAuthToken },
    } = await this.parse(SetupNgrok)
    const globalConfigs = await this.getGlobalConfigs(false)
    let authToken = inputAuthToken

    if (!authToken) {
      const result = await this.prompt<{ authToken: string }>([
        {
          name: 'authToken',
          type: 'password',
          message: 'Your ngrok auth token',
        },
      ])
      authToken = result.authToken
    }

    await ngrok.authtoken(authToken)

    await this.setGlobalConfigs({ ...globalConfigs, ngrokToken: authToken }, false)

    this.logSuccess(
      'Token added. Now you can run `bettermode app start` to start the tunnel.',
    )
    return {}
  }
}
