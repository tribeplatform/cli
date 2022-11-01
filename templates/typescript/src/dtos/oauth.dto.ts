import { IsArray, IsString, IsUrl } from 'class-validator'

export class OAuthDto {
  @IsUrl({
    allow_protocol_relative_urls: true,
    allow_trailing_dot: true,
    allow_underscores: true,
    require_tld: true,
    require_protocol: true,
    require_valid_protocol: true,
  })
  networkDomain: string

  @IsUrl({
    allow_protocol_relative_urls: true,
    allow_trailing_dot: true,
    allow_underscores: true,
    require_tld: false,
    require_protocol: true,
    require_valid_protocol: false,
  })
  redirectUri: string

  @IsString({ each: true })
  @IsArray()
  scopes: string[]
}
