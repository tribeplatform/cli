import { WebhookDto, WebhookResponseDto } from '@dtos'
import { WebhookStatus, WebhookType } from '@enums'
import { Webhook, WebhookResponse } from '@interfaces'
import { signatureMiddleware, validationMiddleware } from '@middlewares'
import { WebhookService } from '@services'
import { logger } from '@utils'
import { Body, Controller, HttpCode, Post, UseBefore } from 'routing-controllers'
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi'

@Controller('/webhook')
@UseBefore(signatureMiddleware)
export class WebhookController {
  readonly webhookService = new WebhookService()

  @Post()
  @UseBefore(validationMiddleware(WebhookDto, 'body'))
  @OpenAPI({ summary: 'Receives webhooks and acts upon them.' })
  @ResponseSchema(WebhookResponseDto)
  @HttpCode(200)
  async receiveWebhook(@Body() webhook: Webhook): Promise<WebhookResponse> {
    switch (webhook.type) {
      case WebhookType.Test:
        return this.webhookService.handleTestWebhook(webhook)
      case WebhookType.AppInstalled:
        return this.webhookService.handleInstalledWebhook(webhook)
      case WebhookType.AppUninstalled:
        return this.webhookService.handleUninstalledWebhook(webhook)
      default:
        logger.verbose('Received unknown webhook', webhook)
        return {
          type: webhook.type,
          status: WebhookStatus.Succeeded,
        }
    }
  }
}
