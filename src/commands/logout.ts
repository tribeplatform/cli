import { StandardColors } from '@salesforce/sf-plugins-core'
import { BetterCommand } from '../better-command'
import { setConfigs } from '../utils'

type LogoutResponse = { succeeded: boolean }

export default class Logout extends BetterCommand<LogoutResponse> {
  static description = 'logout from Bettermode portal'

  static examples = [`$ bettermode logout`]

  async run(): Promise<LogoutResponse> {
    await setConfigs({ API_TOKEN: '', EMAIL: '' })

    this.log(StandardColors.warning('You have successfully logged out.'))
    return { succeeded: true }
  }
}
