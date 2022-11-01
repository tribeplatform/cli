import { CliUx } from '@oclif/core'
import { Network } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../better-command'

type NetworksResponse = { networks: Network[] }

export default class Networks extends BetterCommand<NetworksResponse> {
  static description = 'list your networks'

  static examples = [`$ bettermode networks`]

  static flags = { ...BetterCommand.flags, ...CliUx.ux.table.flags() }

  getNetworks = async (): Promise<Network[]> => {
    const client = await this.getClient()
    return client.query({ name: 'networks', args: 'basic' })
  }

  async run(): Promise<NetworksResponse> {
    this.spinner.start('Getting your info ...')

    const { flags } = await this.parse(Networks)
    const networks = await this.getNetworks()

    this.spinner.stop('done\n')

    CliUx.ux.table(
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
