import { Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { App } from '@tribeplatform/gql-client/global-types'
import { APP_LANGUAGE_CHOICES } from '../../constants'
import { AppLanguage } from '../../types'
import { getClient, UnAuthorizedError } from '../../utils'

type CreateAppResponse = { app: App }

export default class CreateApp extends SfCommand<CreateAppResponse> {
  static description = 'create a new app'

  static examples = [`$ bettermode create app`]

  static flags = {
    'api-token': Flags.string({
      char: 't',
      summary: 'your API token',
      description: 'the API token that you want to use to login in the portal',
      env: 'BETTERMODE_API_TOKEN',
      required: false,
    }),
  }

  async run(): Promise<CreateAppResponse> {
    this.spinner.start('Getting your info ...')

    const {
      flags: { 'api-token': apiToken },
    } = await this.parse(CreateApp)
    const client = await getClient(apiToken)
    const networks = await client.query({ name: 'networks', args: 'basic' })

    this.spinner.stop('done\n')

    if (networks.length === 0) {
      throw new UnAuthorizedError(`You don't have any networks, please create one first.`)
    }

    const { name, networkId, language } = await this.prompt<{
      networkId: string
      name: string
      language: AppLanguage
    }>([
      {
        name: 'networkId',
        type: 'list',
        default: networks[0].id,
        message: `Please select a network for your app:`,
        choices: networks.map(network => ({
          name: network.domain,
          value: network.id,
        })),
      },
      {
        name: 'name',
        type: 'input',
        default: 'New App',
        message: `Please enter your app's name:`,
      },
      {
        name: 'language',
        type: 'list',
        default: APP_LANGUAGE_CHOICES.ts,
        message: `Please select your preferred coding language:`,
        choices: Object.keys(APP_LANGUAGE_CHOICES).map(language => ({
          name: APP_LANGUAGE_CHOICES[language as AppLanguage],
          value: language,
        })),
      },
      {
        name: 'confirm',
        type: 'confirm',
        default: true,
        message: `Are you sure you want to create this app?`,
      },
    ])

    this.logSuccess('You have successfully created an app!')
    return { app: null as any }
  }
}
