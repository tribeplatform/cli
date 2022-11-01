import { StandardColors } from '@salesforce/sf-plugins-core'
import { BetterCommand } from '../better-command'

type WhoAmIResponse = { email: string }

export default class WhoAmI extends BetterCommand<WhoAmIResponse> {
  static description = 'check your authorized email address'

  static examples = [`$ bettermode whoami`]

  async run(): Promise<WhoAmIResponse> {
    const { email } = await this.getConfigs()
    this.log(`You are logged in as ${StandardColors.success(email)}`)
    return { email }
  }
}
