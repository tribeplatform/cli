import { CliUx } from '@oclif/core'
import { BaseCommand } from './base'

export default class Networks extends BaseCommand {
  static description = 'Shows your networks'

  static examples = [`$ bettermode networks`]

  static flags = {
    ...CliUx.ux.table.flags(),
  }

  async run(): Promise<void> {
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
  }
}
