import { ClientError, GlobalClient } from '@tribeplatform/gql-client'
import { CUSTOM_API_TOKEN } from '../constants'
import { getConfigs } from './configs.utils'
import { CliError, InvalidTokenError, UnAuthorizedError } from './error.utils'

export const getClient = async (): Promise<GlobalClient> => {
  let accessToken = CUSTOM_API_TOKEN
  if (!accessToken) {
    const configs = await getConfigs()
    accessToken = configs.API_TOKEN
  }

  if (!accessToken) {
    throw new UnAuthorizedError()
  }

  return new GlobalClient({ accessToken })
}

export const makeClientRequest = async <P>(
  promise: Promise<P>,
  customError?: string,
): Promise<P> => {
  try {
    return await promise
  } catch (e) {
    const error = e as ClientError
    const errorMessage = error?.response?.errors?.[0]?.message
    if (errorMessage === 'Unauthorized') {
      throw new InvalidTokenError(error)
    }
    throw new CliError(errorMessage || customError, error)
  }
}
