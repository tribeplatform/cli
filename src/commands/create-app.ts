import { Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { App } from '@tribeplatform/gql-client/global-types'
import * as Listr from 'listr'
import { APP_LANGUAGE_CHOICES } from '../constants'
import { AppLanguage } from '../types'
import { CommandAbortedError, getClient, UnAuthorizedError } from '../utils'

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

    const { name, repo, networkId, language, confirmed } = await this.prompt<{
      networkId: string
      name: string
      repo: string
      language: AppLanguage
      confirmed: boolean
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
        message: `Please select a name for your app:`,
      },
      {
        name: 'repo',
        type: 'input',
        default: ({ name }: { name: string }) =>
          `${name.toLowerCase().replace(/[^A-Za-z]/g, '-')}`,
        message: `Please select a repo name for your app:`,
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
        name: 'confirmed',
        type: 'confirm',
        default: true,
        message: `Are you sure you want to create this app?`,
      },
    ])

    if (!confirmed) {
      throw new CommandAbortedError()
    }

    let app: App
    const tasks = new Listr([
      {
        title: 'Create the app in the portal',
        task: async (ctx, task) => {
          app = await client.mutation({
            name: 'createApp',
            args: {
              variables: {
                input: {
                  name,
                  slug: repo,
                  networkId,
                },
              },
              fields: 'basic',
            },
          })

          ctx.app = Boolean(app)
        },
      },
      {
        title: 'Install package dependencies with Yarn',
        enabled: ctx => ctx.app === true,
        task: (ctx, task) => {
          task.output = `Installing dependencies for ${app.name} ...`
        },
      },
    ])

    await tasks.run()
    this.logSuccess('You have successfully created an app!')
    return { app: null as any }
  }
}
