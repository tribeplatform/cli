import { CLIENT_ID, CLIENT_SECRET } from '@config'
import { GlobalClient, TribeClient } from '@tribeplatform/gql-client'
import { logger } from './logger.utils'

export const gqlClient = new GlobalClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  onError: (errors, client, error) => {
    logger.error('GQL Client Error', { errors, client, error })
  },
})

export const getClient = (options: {
  accessToken: string
  graphqlUrl?: string
}): TribeClient => {
  const { accessToken, graphqlUrl } = options
  return new TribeClient({ accessToken, graphqlUrl })
}

export const getNetworkClient = async (networkId: string): Promise<TribeClient> => {
  return await gqlClient.getTribeClient({ networkId })
}

export const getMemberClient = async (
  networkId: string,
  memberId: string,
): Promise<TribeClient> => {
  return await gqlClient.getTribeClient({ networkId, memberId })
}
