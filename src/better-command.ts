import { Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { App, Network } from '@tribeplatform/gql-client/global-types'
import { GithubUser, GlobalConfigs, LocalConfigs } from './types'
import {
  CliClient,
  getClient,
  getGithubUsername,
  getGlobalConfigs,
  getLocalConfigs,
  setGlobalConfigs,
  setLocalConfigs,
  Shell,
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

  getGlobalFlags = async (): Promise<{
    dev: boolean
    accessToken?: string
  }> => {
    const {
      flags: { 'access-token': accessToken, dev = false },
    } = await this.parse(this.constructor as any)

    return { dev, accessToken }
  }

  getGlobalConfigs = async (customDev?: boolean): Promise<GlobalConfigs> => {
    const { dev } = await this.getGlobalFlags()

    return getGlobalConfigs(customDev === undefined ? dev : customDev)
  }

  setGlobalConfigs = async (configs: GlobalConfigs, customDev?: boolean): Promise<void> => {
    const { dev } = await this.getGlobalFlags()

    return setGlobalConfigs(configs, { dev: customDev === undefined ? dev : customDev })
  }

  getLocalConfigs = async (customDev?: boolean): Promise<LocalConfigs> => {
    const { dev } = await this.getGlobalFlags()

    return getLocalConfigs(customDev === undefined ? dev : customDev)
  }

  setLocalConfigs = async (configs: LocalConfigs): Promise<void> => {
    const { dev } = await this.getGlobalFlags()

    return setLocalConfigs(configs, { dev })
  }

  getUnAuthenticatedClient = async (customDev?: boolean): Promise<CliClient> => {
    const { dev } = await this.getGlobalFlags()

    return getClient({
      withoutToken: true,
      dev: customDev === undefined ? dev : customDev,
    })
  }

  getClient = async (customDev?: boolean): Promise<CliClient | null> => {
    const { dev, accessToken: customAccessToken } = await this.getGlobalFlags()

    const { accessToken } = await this.getGlobalConfigs(customDev)
    const finalAccessToken = customAccessToken || accessToken
    return finalAccessToken
      ? getClient({
          customAccessToken: finalAccessToken,
          dev: customDev === undefined ? dev : customDev,
        })
      : null
  }

  runWithSpinner = async <T>(message: string, action: () => Promise<T>): Promise<T> => {
    this.spinner.start(`${message} `)
    const result = await action()
    this.spinner.stop('done\n')
    return result
  }

  getGithubUser = async (): Promise<GithubUser | null> => {
    try {
      const name = await Shell.exec('git config user.name')
      const email = await Shell.exec('git config user.email')
      return {
        name,
        email,
        username: await getGithubUsername(email),
      }
    } catch {
      return null
    }
  }

  getNetworks = async (customDev?: boolean): Promise<Network[]> => {
    const client = await this.getClient(customDev)
    if (!client) {
      throw new UnAuthorizedError()
    }

    return client.query({ name: 'networks', args: 'basic' })
  }

  getApps = async (customDev?: boolean): Promise<App[]> => {
    const client = await this.getClient(customDev)
    if (!client) {
      throw new UnAuthorizedError()
    }

    const { nodes: apps } = await client.query({
      name: 'apps',
      args: {
        variables: { limit: 100 },
        fields: {
          nodes: {
            image: 'all',
            favicon: 'all',
            customCodes: 'all',
          },
        },
      },
    })
    return apps || []
  }
}
