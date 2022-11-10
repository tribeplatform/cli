/* eslint-disable @typescript-eslint/naming-convention */

export interface OAuthToken {
  access_token: string
  refresh_token: string
  expires_in: number
  graphql_url: string
}
