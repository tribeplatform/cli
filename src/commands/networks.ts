import { Network } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../better-command'

type NetworksResponse = { networks: Network[] }

export default class Networks extends BetterCommand<NetworksResponse> {
  static description = 'list your networks'

  static examples = [`$ bettermode networks`]

  static flags = { ...BetterCommand.tableFlags() }

  async run(): Promise<NetworksResponse> {
    const networks = await this.getNetworks()

    const { flags } = await this.parse(Networks)
    this.table(
      networks,
      {
        id: {
          header: 'ID',
        },
        name: {
          header: 'Name',
          minWidth: 7,
        },
        domain: {
          header: 'Domain',
        },
        plan: {
          header: 'Plan',
          extended: true,
        },
        status: {
          header: 'Status',
          extended: true,
        },
        gatewayUrl: {
          header: 'Gateway URL',
          extended: true,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      },
    )
    return { networks }
  }
}
