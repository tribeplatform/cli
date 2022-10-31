import { Command } from '@oclif/core'
import { ClientError } from '@tribeplatform/gql-client'
import { INVALID_TOKEN, SERVER_ERROR } from '../errors'

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
