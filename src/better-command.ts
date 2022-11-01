import { Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { Configs } from './types'
import { CliClient, getClient, getConfigs, setConfigs } from './utils'

export abstract class BetterCommand<T> extends SfCommand<T> {
  static flags = {
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

  async getConfigs(): Promise<Configs> {
    const {
      flags: { dev },
    } = await this.parse(BetterCommand)

    return getConfigs(dev)
  }

  async setConfigs(configs: Configs): Promise<void> {
    const {
      flags: { dev },
    } = await this.parse(BetterCommand)

    return setConfigs(configs, dev)
  }

  async getClient(withoutToken = false): Promise<CliClient> {
    if (withoutToken) {
      return getClient({ withoutToken })
    }

    const {
      flags: { dev, 'access-token': customAccessToken },
    } = await this.parse(BetterCommand)

    const { accessToken } = await this.getConfigs()
    return getClient({ customAccessToken: customAccessToken || accessToken, dev })
  }
}
