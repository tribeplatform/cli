import { WebhookInputDto, WebhookResponseDto } from '@dtos'
import { WebhookStatus } from '@enums'
import { signatureMiddleware, validationMiddleware } from '@middlewares'
import { logger } from '@utils'
import { Body, Controller, HttpCode, Post, UseBefore } from 'routing-controllers'
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi'

@Controller('/webhook')
@UseBefore(signatureMiddleware)
export class WebhookController {
  @Post()
  @UseBefore(validationMiddleware(WebhookInputDto, 'body'))
  @OpenAPI({ summary: 'Receives webhooks and acts upon them.' })
  @ResponseSchema(WebhookResponseDto)
  @HttpCode(200)
  async receiveWebhook(@Body() webhook: WebhookInputDto): Promise<WebhookResponseDto> {
    logger.verbose('Received webhook', webhook)
    return {
      type: webhook.type,
      status: WebhookStatus.SUCCEEDED,
    }
  }
}
