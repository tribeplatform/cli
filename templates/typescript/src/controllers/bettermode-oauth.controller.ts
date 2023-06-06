import { OAuthDto, OAuthTokensDto, OAuthTokensInputDto } from '@dtos'
import { getBettermodeOAuthUrl, getBettermodeOauthTokens } from '@logics'
import { validationMiddleware } from '@middlewares'
import { globalLogger } from '@utils'
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
  readonly logger = globalLogger.setContext(BettermodeOAuthController.name)

  @Get()
  @UseBefore(validationMiddleware(OAuthDto, 'params'))
  @OpenAPI({ summary: 'Handles app installation using oauth.' })
  @HttpCode(302)
  async redirect(
    @Params({ required: true, type: OAuthDto, validate: true, parse: true })
    input: OAuthDto,
    @Res() response: Response,
  ): Promise<Response> {
    this.logger.verbose('Received oauth redirect request', input)

    response.redirect(getBettermodeOAuthUrl(input))
    return response
  }

  @Post('/token')
  @UseBefore(validationMiddleware(OAuthTokensInputDto, 'body'))
  @OpenAPI({ summary: 'Returns OAuth tokens based on the input.' })
  @ResponseSchema(OAuthTokensDto)
  @HttpCode(200)
  async tokens(@Body() input: OAuthTokensInputDto): Promise<OAuthTokensDto> {
    this.logger.verbose('Received oauth tokens request', input)

    return getBettermodeOauthTokens(input)
  }
}
