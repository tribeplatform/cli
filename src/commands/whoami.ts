import color from '@oclif/color'
import { getConfigs } from '../utils'
import { BaseCommand } from './base'

export default class WhoAmI extends BaseCommand {
  static description = 'Shows your authorized email address'

  static examples = [`$ bettermode whoami`]

  async run(): Promise<void> {
    const { EMAIL } = await getConfigs()
    this.log(`You are logged in as ${color.green(EMAIL)}`)
  }
}
