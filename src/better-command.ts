import { Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { Network } from '@tribeplatform/gql-client/global-types'
import { Configs } from './types'
import { CliClient, getClient, getConfigs, setConfigs } from './utils'

export abstract class BetterCommand<T> extends SfCommand<T> {
  static globalFlags = {
    ...SfCommand.globalFlags,
    'access-token': Flags.string({
      char: 't',
      summary: 'your access token',
      description: 'a custom access token that you want to use to login in the portal',
      env: 'BETTERMODE_ACCESS_TOKEN',
      required: false,
    }),
    dev: Flags.boolean({
      char: 'd',
      summary: 'development mode',
      description: 'actions will happen in development mode',
      env: 'BETTERMODE_DEV',
      required: false,
    }),
  }

  getConfigs = async (): Promise<Configs> => {
    const {
      flags: { dev },
    } = await this.parse(BetterCommand)

    return getConfigs(dev)
  }

  setConfigs = async (configs: Configs): Promise<void> => {
    const {
      flags: { dev },
    } = await this.parse(BetterCommand)

    return setConfigs(configs, dev)
  }

  getClient = async (withoutToken = false): Promise<CliClient> => {
    if (withoutToken) {
      return getClient({ withoutToken })
    }

    const {
      flags: { dev, 'access-token': customAccessToken },
    } = await this.parse(BetterCommand)

    const { accessToken } = await this.getConfigs()
    return getClient({ customAccessToken: customAccessToken || accessToken, dev })
  }

  runWithSpinner = async <T>(action: () => Promise<T>): Promise<T> => {
    this.spinner.start('Getting your info ')
    const result = await action()
    this.spinner.stop('done\n')
    return result
  }

  getNetworks = async (): Promise<Network[]> => {
    return this.runWithSpinner(async () => {
      const client = await this.getClient()
      return client.query({ name: 'networks', args: 'basic' })
    })
  }
}
