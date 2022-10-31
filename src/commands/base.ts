import color from '@oclif/color'
import { Command } from '@oclif/core'
import { PrettyPrintableError } from '@oclif/core/lib/interfaces'
import { GlobalClient } from '@tribeplatform/gql-client'
import { Network } from '@tribeplatform/gql-client/global-types'
import { CUSTOM_API_TOKEN } from '../constants'
import { NOT_LOGGED_IN, NO_ACCESS_TO_CONFIG_ERROR } from '../errors'
import {
  getConfigs,
  hasAccessToConfig,
  isConfigExists,
  makeClientRequest,
} from '../utils'

export abstract class BaseCommand extends Command {
  getClient = async (): Promise<GlobalClient> => {
    let accessToken = CUSTOM_API_TOKEN
    if (!accessToken) {
      const hasConfig = await isConfigExists()
      if (!hasConfig) {
        this.error(NOT_LOGGED_IN)
      }

      const hasAccess = await hasAccessToConfig()
      if (!hasAccess) {
        this.error(NO_ACCESS_TO_CONFIG_ERROR)
      }

      const configs = await getConfigs()

      accessToken = configs.API_TOKEN
    }

    if (!accessToken) {
      this.error(NOT_LOGGED_IN)
    }

    return new GlobalClient({ accessToken })
  }

  getNetworks = async (): Promise<Network[]> => {
    const client = await this.getClient()
    return await makeClientRequest(
      client.query({ name: 'networks', args: 'basic' }),
      this,
    )
  }

  error(
    input: string | Error,
    options: { code?: string | undefined; exit: false } & PrettyPrintableError,
  ): void
  error(
    input: string | Error,
    options?:
      | ({ code?: string | undefined; exit?: number | undefined } & PrettyPrintableError)
      | undefined,
  ): never
  error(input: any, options?: any): void {
    if (input instanceof Error) {
      super.error(input, options)
    }

    super.error(`${color.red(input)}`, options)
  }
}
