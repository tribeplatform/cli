import { Flags } from '@oclif/core'
import { App, Network } from '@tribeplatform/gql-client/global-types'

import { BetterCommand } from '../../better-command'
import { TYPEFACE } from '../../constants'
import {
  getCreateAppInputs,
  getCreateAppTasks,
  removeCreateAppTargetDirs,
} from '../../logics'
import { CliClient, UnAuthorizedError } from '../../utils'

type CreateAppResponse = App

export default class CreateApp extends BetterCommand<CreateAppResponse> {
  static description = 'create a new app'

  static examples = [`$ bettermode app create`]

  static flags = {
    'both-envs': Flags.boolean({
      char: 'b',
      summary: 'create on both environments',
      description: 'create the app in both dev and prod environments',
      env: 'BETTERMODE_BOTH_ENVS',
      required: false,
    }),
    'skip-git': Flags.boolean({
      char: 'g',
      summary: 'skip git',
      description: 'skip git initialization',
      env: 'BETTERMODE_SKIP_GIT',
      required: false,
    }),
  }

  async run(): Promise<CreateAppResponse> {
    const {
      flags: { 'both-envs': bothEnvs, 'skip-git': skipGit, dev },
    } = await this.parse(CreateApp)
    const { officialPartner } = await this.getGlobalConfigs()

    let client: CliClient | null = null
    let networks: Network[] = []
    if (!dev || bothEnvs) {
      client = await this.getClient(false)
      networks = await this.getNetworks(false)

      if (!client) {
        throw new UnAuthorizedError()
      }

      if (networks.length === 0) {
        throw new UnAuthorizedError(
          `You don't have any networks, please create one first.`,
        )
      }
    }

    let devClient: CliClient | null = null
    let devNetworks: Network[] = []
    if (dev || bothEnvs) {
      devClient = await this.getClient(true)
      devNetworks = await this.getNetworks(true)

      if (!devClient) {
        this.log('In development environment:')
        throw new UnAuthorizedError()
      }

      if (devNetworks.length === 0) {
        throw new UnAuthorizedError(
          `You don't have any networks on development environment, please create one first.`,
        )
      }
    }

    const githubUser = await this.getGithubUser()

    this.log(TYPEFACE)
    this.log(`Let's create your next amazing app!\n\n`)

    const input = await this.prompt(
      getCreateAppInputs({
        client,
        devClient,
        networks,
        devNetworks,
        officialPartner,
        githubUser,
        skipGit,
      }),
    )

    const tasks = getCreateAppTasks({
      client,
      devClient,
      officialPartner,
      input,
      skipGit,
    })

    let app: App
    try {
      const ctx = await tasks.run()
      app = ctx?.app as App
      if (!app) {
        throw new Error('App creation failed')
      }
    } catch (error) {
      removeCreateAppTargetDirs(input)
      throw error
    }

    this.logSuccess('You have successfully created an app!')
    return app
  }
}
