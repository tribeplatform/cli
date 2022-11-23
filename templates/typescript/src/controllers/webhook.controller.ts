import { WebhookDto, WebhookResponseDto } from '@dtos'
import { WebhookStatus, WebhookType } from '@enums'
import {
  FederatedSearchWebhook,
  FederatedSearchWebhookResponse,
  InteractionWebhook,
  InteractionWebhookResponse,
  Webhook,
  WebhookResponse,
} from '@interfaces'
import {
  getChallengeResponse,
  handleFederatedSearchWebhook,
  handleInstalledWebhook,
  handleInteractionWebhook,
  handleSubscriptionWebhook,
  handleUninstalledWebhook,
} from '@logics'
import { signatureMiddleware, validationMiddleware } from '@middlewares'
import { Logger } from '@utils'
import { Body, Controller, HttpCode, Post, UseBefore } from 'routing-controllers'
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi'

@Controller('/webhook')
@UseBefore(signatureMiddleware)
export class WebhookController {
  readonly logger = new Logger(WebhookController.name)

  @Post()
  @UseBefore(validationMiddleware(WebhookDto, 'body'))
  @OpenAPI({ summary: 'Receives webhooks and acts upon them.' })
  @ResponseSchema(WebhookResponseDto)
  @HttpCode(200)
  async receiveWebhook(@Body() webhook: Webhook): Promise<WebhookResponse> {
    this.logger.verbose('Received webhook', webhook)

    switch (webhook.type) {
      case WebhookType.Test:
        return getChallengeResponse(webhook)
      case WebhookType.AppInstalled:
        return handleInstalledWebhook(webhook)
      case WebhookType.AppUninstalled:
        return handleUninstalledWebhook(webhook)
      case WebhookType.Subscription:
        return handleSubscriptionWebhook(webhook)
      default:
        this.logger.verbose('Received unknown webhook', webhook)
        return {
          type: webhook.type,
          status: WebhookStatus.Succeeded,
        }
    }
  }

  @Post('/search')
  @UseBefore(validationMiddleware(WebhookDto, 'body'))
  @OpenAPI({ summary: 'Receives federated search requests and returns the result.' })
  @ResponseSchema(WebhookResponseDto)
  @HttpCode(200)
  async receiveFederatedSearch(
    @Body() webhook: FederatedSearchWebhook,
  ): Promise<FederatedSearchWebhookResponse> {
    this.logger.verbose('Received federated search request', webhook)

    return handleFederatedSearchWebhook(webhook)
  }

  @Post('/interaction')
  @UseBefore(validationMiddleware(WebhookDto, 'body'))
  @OpenAPI({ summary: 'Receives federated search requests and returns the result.' })
  @ResponseSchema(WebhookResponseDto)
  @HttpCode(200)
  async receiveInteraction(
    @Body() webhook: InteractionWebhook,
  ): Promise<InteractionWebhookResponse> {
    this.logger.verbose('Received interaction request', webhook)

    return handleInteractionWebhook(webhook)
  }
}
