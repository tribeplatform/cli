import { WebhookDto, WebhookResponseDto } from '@dtos'
import { WebhookStatus, WebhookType } from '@enums'
import { Webhook } from '@interfaces'
import { getChallengeResponse } from '@logics'
import { signatureMiddleware, validationMiddleware } from '@middlewares'
import { logger } from '@utils'
import { Body, Controller, HttpCode, Post, UseBefore } from 'routing-controllers'
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi'

@Controller('/webhook')
@UseBefore(signatureMiddleware)
export class WebhookController {
  @Post()
  @UseBefore(validationMiddleware(WebhookDto, 'body'))
  @OpenAPI({ summary: 'Receives webhooks and acts upon them.' })
  @ResponseSchema(WebhookResponseDto)
  @HttpCode(200)
  async receiveWebhook(@Body() webhook: Webhook): Promise<WebhookResponseDto> {
    logger.verbose('Received webhook', webhook)

    switch (webhook.type) {
      case WebhookType.Test:
        return getChallengeResponse(webhook)
      default:
        return {
          type: webhook.type,
          status: WebhookStatus.Succeeded,
        }
    }
  }
}
