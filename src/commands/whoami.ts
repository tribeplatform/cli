import { StandardColors } from '@salesforce/sf-plugins-core'
import { BetterCommand } from '../better-command'
import { UnAuthorizedError } from '../utils'

type WhoAmIResponse = { email: string }

export default class WhoAmI extends BetterCommand<WhoAmIResponse> {
  static description = 'check your authorized email address'

  static examples = [`$ bettermode whoami`]

  async run(): Promise<WhoAmIResponse> {
    const { email } = await this.getGlobalConfigs()
    if (!email) {
      throw new UnAuthorizedError()
    }

    this.log(`You are logged in as ${StandardColors.success(email)}`)
    return { email }
  }
}
