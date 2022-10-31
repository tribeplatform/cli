import { SfCommand, StandardColors } from '@salesforce/sf-plugins-core'
import { getConfigs } from '../utils'

type WhoAmIResponse = { email: string }
export default class WhoAmI extends SfCommand<WhoAmIResponse> {
  static description = 'check your authorized email address'

  static examples = [`$ bettermode whoami`]

  async run(): Promise<WhoAmIResponse> {
    const { EMAIL: email } = await getConfigs()
    this.log(`You are logged in as ${StandardColors.success(email)}`)
    return { email }
  }
}
