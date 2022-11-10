/* eslint-disable @typescript-eslint/naming-convention */

import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator'

export class OAuthTokensInputDto {
  @IsUrl({
    allow_protocol_relative_urls: true,
    allow_trailing_dot: true,
    allow_underscores: true,
    require_tld: true,
    require_protocol: true,
    require_valid_protocol: true,
  })
  networkDomain: string

  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsString()
  refreshToken?: string
}

export class OAuthTokensDto {
  @IsString()
  accessToken: string

  @IsString()
  refreshToken: string

  @IsInt()
  expiresIn: number

  @IsString()
  networkId: string

  @IsString()
  memberId: string

  @IsString()
  graphqlUrl: string
}
