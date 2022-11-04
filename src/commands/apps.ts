import { CliUx } from '@oclif/core'
import { App } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../better-command'
import { UnAuthorizedError } from '../utils'

type AppsResponse = { apps: App[] }

export default class Apps extends BetterCommand<AppsResponse> {
  static description = 'list your apps'

  static examples = [`$ bettermode apps`]

  static flags = { ...CliUx.ux.table.flags() }

  getApps = async (): Promise<App[]> => {
    return this.runWithSpinner(async () => {
      const client = await this.getClient()
      if (!client) {
        throw new UnAuthorizedError()
      }

      const { nodes: apps } = await client.query({
        name: 'apps',
        args: {
          variables: { limit: 100 },
          fields: {
            nodes: 'basic',
          },
        },
      })
      return apps || []
    })
  }

  async run(): Promise<AppsResponse> {
    const apps = await this.getApps()

    const { flags } = await this.parse(Apps)
    CliUx.ux.table(
      apps,
      {
        id: {
          header: 'ID',
        },
        name: {
          header: 'Name',
          minWidth: 7,
        },
        slug: {
          header: 'Slug',
        },
        status: {
          header: 'Status',
        },
        plan: {
          header: 'Plan',
          extended: true,
        },
        clientId: {
          header: 'Client ID',
          extended: true,
        },
        clientSecret: {
          header: 'Client Secret',
          extended: true,
        },
        signingSecret: {
          header: 'Signing Secret',
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      },
    )
    return { apps }
  }
}
