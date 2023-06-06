/* eslint-disable @typescript-eslint/naming-convention */

import { getBettermodeClient } from '@clients'
import { CLIENT_ID, CLIENT_SECRET } from '@config'
import { OAuthDto, OAuthTokensDto, OAuthTokensInputDto } from '@dtos'
import { HttpError, InternalServerError } from '@errors'
import { OAuthToken } from '@interfaces'
import { MemberRepository } from '@repositories'
import { globalLogger } from '@utils'
import axios from 'axios'

const logger = globalLogger.setContext(`BettermodeOAuth`)

export const getBettermodeOAuthUrl = (input: OAuthDto): string => {
  logger.debug('getRedirectUrl called', { input })

  const { networkDomain, redirectUri, scopes } = input
  return `https://${networkDomain}/oauth/authorize?${new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    scopes: scopes.join(' '),
  }).toString()}`
}

export const getBettermodeOauthTokens = async (
  input: OAuthTokensInputDto,
): Promise<OAuthTokensDto> => {
  logger.debug('getTokens called', { input })

  const { code, refreshToken, networkDomain } = input

  let data: OAuthToken
  try {
    const result = await axios.post<OAuthToken>(`https://${networkDomain}/oauth/token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      refresh_token: refreshToken,
      grant_type: code ? 'authorization_code' : 'refresh_token',
    })
    data = result.data
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new HttpError(error.response.status, error.response.data, { error })
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw new InternalServerError('No response received.', { error })
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new InternalServerError('Unknown error happened.', { error })
    }
  }

  const client = getBettermodeClient({
    accessToken: data.access_token,
    graphqlUrl: data.graphql_url,
  })

  const member = await client.query({ name: 'authMember', args: 'basic' })
  await MemberRepository.upsert(member.id, {
    networkId: member.networkId,
    email: member.email,
    name: member.name,
    refreshToken: data.refresh_token,
  })

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    networkId: member.networkId,
    memberId: member.id,
    graphqlUrl: data.graphql_url,
  }
}
