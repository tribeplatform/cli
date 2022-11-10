import { CLIENT_ID, CLIENT_SECRET } from '@config'
import { GlobalClient, TribeClient } from '@tribeplatform/gql-client'

import { Logger } from './logger.utils'

const logger = new Logger('GQLClient')

export const gqlClient = new GlobalClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  onError: (errors, client, error) => {
    logger.error(error, { errors, client })
  },
})

export const getClient = (options: {
  accessToken: string
  graphqlUrl?: string
}): TribeClient => {
  const { accessToken, graphqlUrl } = options
  return new TribeClient({ accessToken, graphqlUrl })
}

export const getNetworkClient = (networkId: string): Promise<TribeClient> => {
  return gqlClient.getTribeClient({ networkId })
}

export const getMemberClient = (
  networkId: string,
  memberId: string,
): Promise<TribeClient> => {
  return gqlClient.getTribeClient({ networkId, memberId })
}
