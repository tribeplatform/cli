import { App } from '@tribeplatform/gql-client/global-types'
import { join } from 'path'
import { BetterCommand } from '../better-command'
import { APP_TEMPLATE_CHOICES } from '../constants'
import { getCreateAppTasks } from '../logics'
import { AppTemplate } from '../types'
import { CommandAbortedError, Shell, UnAuthorizedError } from '../utils'

type CreateAppResponse = { app: App }

export default class CreateApp extends BetterCommand<CreateAppResponse> {
  static description = 'create a new app'

  static examples = [`$ bettermode create app`]

  async run(): Promise<CreateAppResponse> {
    const { official } = await this.getConfigs()
    const client = await this.getClient()
    const networks = await this.getNetworks()

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
          `${name.toLowerCase().replace(/[^\dA-Za-z]/g, '-')}`,
        message: `Please select a repo name for your app:`,
      },
      {
        name: 'template',
        type: 'list',
        default: APP_TEMPLATE_CHOICES.typescript,
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

    const tasks = getCreateAppTasks({
      client,
      template,
      networkId,
      appName: name,
      repoName: repo,
      official,
    })

    let app: App
    try {
      const ctx = await tasks.run()
      app = ctx?.app as App
      if (!app) {
        throw new Error('App creation failed')
      }
    } catch (error) {
      Shell.rm(join(process.cwd(), repo), { silent: true })
      throw error
    }

    this.logSuccess('You have successfully created an app!')
    return { app }
  }
}
