import { Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'

export abstract class BetterCommand<T> extends SfCommand<T> {
  static flags = {
    'api-token': Flags.string({
      char: 't',
      summary: 'your API token',
      description: 'the API token that you want to use to login in the portal',
      env: 'BETTERMODE_API_TOKEN',
      required: false,
    }),
    dev: Flags.boolean({
      char: 'd',
      summary: 'development mode',
      description: 'actions will happen in development mode',
      env: 'BETTERMODE_DEV',
      required: false,
    }),
  }
}
