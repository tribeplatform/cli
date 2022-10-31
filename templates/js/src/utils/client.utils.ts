import { CLIENT_ID, CLIENT_SECRET } from '@config'
import { GlobalClient } from '@tribeplatform/gql-client'
import { logger } from './logger.utils'

export const gqlClient = new GlobalClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  onError: (errors, client, error) => {
    logger.error('GQL Client Error', { errors, client, error })
  },
})

export const getNetworkClient = async (networkId: string) => {
  return await gqlClient.getTribeClient({ networkId })
}

export const getMemberClient = async (networkId: string, memberId: string) => {
  return await gqlClient.getTribeClient({ networkId, memberId })
}
