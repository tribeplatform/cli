import { CLIENT_ID, CLIENT_SECRET } from '@config'
import { OAuthTokensDto, OAuthTokensInputDto } from '@dtos'
import { OAuthToken } from '@interfaces'
import { MemberRepository } from '@repositories'
import { getClient, logger } from '@utils'
import axios from 'axios'
import { HttpError, InternalServerError } from 'routing-controllers'

export class BettermodeOAuthService {
  async getTokens(input: OAuthTokensInputDto): Promise<OAuthTokensDto> {
    const { code, refreshToken, networkDomain } = input

    let data: OAuthToken
    try {
      const result = await axios.post<OAuthToken>(
        `https://${networkDomain}/oauth/token`,
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          refresh_token: refreshToken,
          grant_type: code ? 'authorization_code' : 'refresh_token',
        },
      )
      data = result.data
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new HttpError(error.response.status, error.response.data)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        logger.error(error)
        throw new InternalServerError('No response received.')
      } else {
        // Something happened in setting up the request that triggered an Error
        logger.error(error)
        throw new InternalServerError('Unknown error happened.')
      }
    }

    const client = getClient({
      accessToken: data.access_token,
      graphqlUrl: data.graphql_url,
    })

    const member = await client.query({ name: 'authMember', args: 'basic' })
    await MemberRepository.upsert({
      memberId: member.id,
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
}
