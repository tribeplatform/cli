import { CLIENT_ID, CLIENT_SECRET, GRAPHQL_URL } from '@config'
import { GlobalClient, TribeClient } from '@tribeplatform/gql-client'
import { globalLogger } from '@utils'

const logger = globalLogger.setContext('BettermodeClient')

export const bettermodeClient = new GlobalClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  graphqlUrl: GRAPHQL_URL,
  onError: (errors, client, error) => {
    logger.error(error, { errors, client })
  },
})

export const getBettermodeClient = (options: {
  accessToken: string
  graphqlUrl?: string
}): TribeClient => {
  const { accessToken, graphqlUrl } = options
  return new TribeClient({ accessToken, graphqlUrl })
}

export const getNetworkClient = (networkId: string): Promise<TribeClient> => {
  return bettermodeClient.getTribeClient({ networkId })
}

export const getMemberClient = (
  networkId: string,
  memberId: string,
): Promise<TribeClient> => {
  return bettermodeClient.getTribeClient({ networkId, memberId })
}
