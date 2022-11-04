import { Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { Network } from '@tribeplatform/gql-client/global-types'
import { GlobalConfigs, LocalConfigs } from './types'
import {
  CliClient,
  getClient,
  getGlobalConfigs,
  getLocalConfigs,
  setGlobalConfigs,
  setLocalConfigs,
  UnAuthorizedError,
} from './utils'

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

  getGlobalConfigs = async (): Promise<GlobalConfigs> => {
    const {
      flags: { dev },
    } = await this.parse(this.constructor as any)

    return getGlobalConfigs(dev)
  }

  setGlobalConfigs = async (configs: GlobalConfigs): Promise<void> => {
    const {
      flags: { dev },
    } = await this.parse(this.constructor as any)

    return setGlobalConfigs(configs, { dev })
  }

  getLocalConfigs = async (): Promise<LocalConfigs> => {
    const {
      flags: { dev },
    } = await this.parse(this.constructor as any)

    return getLocalConfigs(dev)
  }

  setLocalConfigs = async (configs: LocalConfigs): Promise<void> => {
    const {
      flags: { dev },
    } = await this.parse(this.constructor as any)

    return setLocalConfigs(configs, { dev })
  }

  getUnAuthenticatedClient = async (): Promise<CliClient> => {
    const {
      flags: { dev },
    } = await this.parse(this.constructor as any)

    return getClient({ withoutToken: true, dev })
  }

  getClient = async (): Promise<CliClient | null> => {
    const {
      flags: { dev, 'access-token': customAccessToken },
    } = await this.parse(this.constructor as any)

    const { accessToken } = await this.getGlobalConfigs()
    const finalAccessToken = customAccessToken || accessToken
    return finalAccessToken
      ? getClient({ customAccessToken: finalAccessToken, dev })
      : null
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
      if (!client) {
        throw new UnAuthorizedError()
      }

      return client.query({ name: 'networks', args: 'basic' })
    })
  }
}
