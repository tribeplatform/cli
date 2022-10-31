import { Command } from '@oclif/core'
import { ClientError, GlobalClient } from '@tribeplatform/gql-client'
import { CUSTOM_API_TOKEN } from '../constants'
import {
  INVALID_TOKEN,
  NOT_LOGGED_IN,
  NO_ACCESS_TO_CONFIG_ERROR,
  SERVER_ERROR,
} from '../errors'
import { getConfigs, hasAccessToConfig, isConfigExists } from './configs.utils'

export const getClient = async (command: Command): Promise<GlobalClient> => {
  let accessToken = CUSTOM_API_TOKEN
  if (!accessToken) {
    const hasConfig = await isConfigExists()
    if (!hasConfig) {
      command.error(NOT_LOGGED_IN)
    }

    const hasAccess = await hasAccessToConfig()
    if (!hasAccess) {
      command.error(NO_ACCESS_TO_CONFIG_ERROR)
    }

    const configs = await getConfigs()

    accessToken = configs.API_TOKEN
  }

  if (!accessToken) {
    command.error(NOT_LOGGED_IN)
  }

  return new GlobalClient({ accessToken })
}

export const makeClientRequest = async <P>(
  promise: Promise<P>,
  command: Command,
  customError?: string,
): Promise<P> => {
  try {
    return await promise
  } catch (e) {
    const error = e as ClientError
    const errorMessage = error.response.errors?.[0]?.message
    if (errorMessage === 'Unauthorized') {
      command.error(INVALID_TOKEN)
    }
    command.error(errorMessage || customError || SERVER_ERROR)
  }
}
