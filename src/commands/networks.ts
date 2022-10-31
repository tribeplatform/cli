import { CliUx } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { Network } from '@tribeplatform/gql-client/global-types'
import { getClient } from '../utils'

type NetworksResponse = { networks: Network[] }

export default class Networks extends SfCommand<NetworksResponse> {
  static description = 'list your networks'

  static examples = [`$ bettermode networks`]

  static flags = {
    ...CliUx.ux.table.flags(),
  }

  getNetworks = async (): Promise<Network[]> => {
    const client = await getClient()
    return client.query({ name: 'networks', args: 'basic' })
  }

  async run(): Promise<NetworksResponse> {
    const { flags } = await this.parse(Networks)
    const networks = await this.getNetworks()
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
