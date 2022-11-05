import { CLIENT_ID } from '@config'
import { OAuthDto, OAuthTokensDto, OAuthTokensInputDto } from '@dtos'
import { validationMiddleware } from '@middlewares'
import { BettermodeOAuthService } from '@services'
import { logger } from '@utils'
import { Response } from 'express'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Params,
  Post,
  Res,
  UseBefore,
} from 'routing-controllers'
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi'

@Controller('/bettermode/oauth')
export class BettermodeOAuthController {
  readonly oauthService = new BettermodeOAuthService()

  @Get()
  @UseBefore(validationMiddleware(OAuthDto, 'params'))
  @OpenAPI({ summary: 'Handles app installation using oauth.' })
  @HttpCode(302)
  async redirect(
    @Params({ required: true, type: OAuthDto, validate: true, parse: true })
    input: OAuthDto,
    @Res() response: Response,
  ): Promise<Response> {
    logger.verbose('Received oauth redirect request', input)

    const { networkDomain, redirectUri, scopes } = input
    response.redirect(
      `https://${networkDomain}/oauth/authorize?${new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: redirectUri,
        scopes: scopes.join(' '),
      }).toString()}`,
    )
    return response
  }

  @Post('/token')
  @UseBefore(validationMiddleware(OAuthTokensInputDto, 'body'))
  @OpenAPI({ summary: 'Returns OAuth tokens based on the input.' })
  @ResponseSchema(OAuthTokensDto)
  @HttpCode(200)
  async tokens(@Body() input: OAuthTokensInputDto): Promise<OAuthTokensDto> {
    logger.verbose('Received oauth tokens request', input)

    return await this.oauthService.getTokens(input)
  }
}
