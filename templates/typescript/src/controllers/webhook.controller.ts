import { WebhookDto, WebhookResponseDto } from '@dtos'
import { WebhookStatus, WebhookType } from '@enums'
import {
  FederatedSearchWebhook,
  FederatedSearchWebhookResponse,
  InteractionWebhook,
  InteractionWebhookResponse,
  TestWebhook,
  TestWebhookResponse,
  Webhook,
  WebhookResponse,
} from '@interfaces'
import {
  getChallengeResponse,
  getShortcutStatesResponse,
  handleFederatedSearchWebhook,
  handleInstalledWebhook,
  handleInteractionWebhook,
  handleSubscriptionWebhook,
  handleUninstalledWebhook,
} from '@logics'
import { signatureMiddleware, validationMiddleware } from '@middlewares'
import { globalLogger } from '@utils'
import { Body, Controller, HttpCode, Post, UseBefore } from 'routing-controllers'
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi'

@Controller('/webhook')
@UseBefore(signatureMiddleware)
export class WebhookController {
  readonly logger = globalLogger.setContext(WebhookController.name)

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
      case WebhookType.ShortcutsStates:
        return getShortcutStatesResponse(webhook)
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
    @Body() webhook: TestWebhook | FederatedSearchWebhook,
  ): Promise<TestWebhookResponse | FederatedSearchWebhookResponse> {
    this.logger.verbose('Received federated search request', webhook)

    switch (webhook.type) {
      case WebhookType.Test:
        return getChallengeResponse(webhook)
      default:
        return handleFederatedSearchWebhook(webhook)
    }
  }

  @Post('/interaction')
  @UseBefore(validationMiddleware(WebhookDto, 'body'))
  @OpenAPI({ summary: 'Receives federated search requests and returns the result.' })
  @ResponseSchema(WebhookResponseDto)
  @HttpCode(200)
  async receiveInteraction(
    @Body() webhook: TestWebhook | InteractionWebhook,
  ): Promise<TestWebhookResponse | InteractionWebhookResponse> {
    this.logger.verbose('Received interaction request', webhook)

    switch (webhook.type) {
      case WebhookType.Test:
        return getChallengeResponse(webhook)
      default:
        return handleInteractionWebhook(webhook)
    }
  }
}
