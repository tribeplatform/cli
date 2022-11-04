import { App } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../../better-command'

type AppsListResponse = App[]

export default class AppsList extends BetterCommand<AppsListResponse> {
  static description = 'list your apps'

  static examples = [`$ bettermode app list`]

  static flags = { ...BetterCommand.tableFlags() }

  async run(): Promise<AppsListResponse> {
    const apps = await this.getApps()

    const { flags } = await this.parse(AppsList)
    this.table(
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
    return apps
  }
}
