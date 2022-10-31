import { ClientError, GlobalClient } from '@tribeplatform/gql-client'
import {
  Mutation,
  MutationName,
  MutationOption,
  Query,
  QueryName,
  QueryOption,
} from '@tribeplatform/gql-client/global-types'
import { CUSTOM_API_TOKEN } from '../constants'
import { getConfigs } from './configs.utils'
import { CliError, InvalidTokenError, UnAuthorizedError } from './error.utils'

export class CliClient extends GlobalClient {
  private getCliError(error: ClientError): CliError {
    const errorMessage = error?.response?.errors?.[0]?.message
    if (errorMessage === 'Unauthorized') {
      return new InvalidTokenError(error)
    }
    return new CliError(errorMessage, error)
  }

  async query<Name extends QueryName>(options: QueryOption<Name>): Promise<Query[Name]> {
    try {
      return await super.query(options)
    } catch (error) {
      throw this.getCliError(error as ClientError)
    }
  }

  async mutation<Name extends MutationName>(
    options: MutationOption<Name>,
  ): Promise<Mutation[Name]> {
    try {
      return await super.mutation(options)
    } catch (error) {
      throw this.getCliError(error as ClientError)
    }
  }
}

export const getClient = async (): Promise<CliClient> => {
  let accessToken = CUSTOM_API_TOKEN
  if (!accessToken) {
    const configs = await getConfigs()
    accessToken = configs.API_TOKEN
  }

  if (!accessToken) {
    throw new UnAuthorizedError()
  }

  return new CliClient({ accessToken })
}
