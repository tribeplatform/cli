import { Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { App } from '@tribeplatform/gql-client/global-types'
import { command } from 'execa'
import * as Listr from 'listr'
import { APP_TEMPLATE_CHOICES, REPO_URL } from '../constants'
import { AppTemplate } from '../types'
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

    const { name, repo, networkId, template, confirmed } = await this.prompt<{
      networkId: string
      name: string
      repo: string
      template: AppTemplate
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
        name: 'template',
        type: 'list',
        default: APP_TEMPLATE_CHOICES.ts,
        message: `Please select your preferred app template:`,
        choices: Object.keys(APP_TEMPLATE_CHOICES).map(template => ({
          name: APP_TEMPLATE_CHOICES[template as AppTemplate],
          value: template,
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

    let app: App | null = null
    let removeFolderOnError = false
    const tasks = new Listr([
      {
        title: `Download ${APP_TEMPLATE_CHOICES[template]} template`,
        task: async () => {
          await command('which git')
          await command(`mkdir ${repo}`)
          await command(`git clone ${REPO_URL} ${repo}/.tmp`)

          removeFolderOnError = true
          await command(`cp -a ${repo}/.tmp/templates/${template}/. ${repo}/`)
          await command(`rm -rf ${repo}/.tmp`)
        },
      },
      {
        title: 'Create the app in the portal',
        task: async () => {
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
        },
      },
    ])

    try {
      await tasks.run()
      if (!app) {
        throw new Error('App creation failed')
      }
    } catch (error) {
      if (removeFolderOnError) await command(`rm -rf ${repo}`, { reject: false })
      throw error
    }

    this.logSuccess('You have successfully created an app!')
    return { app }
  }
}
