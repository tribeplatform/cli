import { WebhookStatus } from '@enums'
import {
  AppInstalledWebhook,
  AppUninstalledWebhook,
  FederatedSearchWebhook,
  FederatedSearchWebhookResponse,
  GeneralWebhookResponse,
  InteractionWebhook,
  InteractionWebhookResponse,
  SubscriptionWebhook,
  TestWebhook,
  TestWebhookResponse,
} from '@interfaces'
import { getChallengeResponse, getServiceUnavailableError } from '@logics'
import { NetworkRepository } from '@repositories'
import { Network } from '@tribeplatform/gql-client/types'
import { getNetworkClient, Logger } from '@utils'

export class WebhookService {
  readonly logger = new Logger(WebhookService.name)

  async handleTestWebhook(webhook: TestWebhook): Promise<TestWebhookResponse> {
    return getChallengeResponse(webhook)
  }

  async handleInstalledWebhook(
    webhook: AppInstalledWebhook,
  ): Promise<GeneralWebhookResponse> {
    let network: Network
    let graphqlUrl: string

    try {
      const client = await getNetworkClient(webhook.networkId)
      graphqlUrl = client.graphqlUrl
      network = await client.query({
        name: 'network',
        args: 'basic',
      })
    } catch (error) {
      this.logger.error('GQL Client Error', error)
      return getServiceUnavailableError(webhook)
    }

    try {
      await NetworkRepository.upsert({
        networkId: network.id,
        name: network.name,
        domain: network.domain,
        graphqlUrl,
      })
    } catch (error) {
      this.logger.error('Database Error', error)
      return getServiceUnavailableError(webhook)
    }

    return {
      type: webhook.type,
      status: WebhookStatus.Succeeded,
    }
  }

  async handleUninstalledWebhook(
    webhook: AppUninstalledWebhook,
  ): Promise<GeneralWebhookResponse> {
    try {
      await NetworkRepository.delete(webhook.networkId)
    } catch (error) {
      this.logger.error('Database Error', error)
      return getServiceUnavailableError(webhook)
    }

    return {
      type: webhook.type,
      status: WebhookStatus.Succeeded,
    }
  }

  async handleSubscriptionWebhook(
    webhook: SubscriptionWebhook,
  ): Promise<GeneralWebhookResponse> {
    // Handle subscription webhooks here

    return {
      type: webhook.type,
      status: WebhookStatus.Succeeded,
    }
  }

  async handleFederatedSearchWebhook(
    webhook: FederatedSearchWebhook,
  ): Promise<FederatedSearchWebhookResponse> {
    // Handle federated search webhook here

    return {
      type: webhook.type,
      status: WebhookStatus.Succeeded,
      data: [],
    }
  }

  async handleInteractionWebhook(
    webhook: InteractionWebhook,
  ): Promise<InteractionWebhookResponse> {
    // Handle interaction webhook here

    return {
      type: webhook.type,
      status: WebhookStatus.Succeeded,
      data: {
        interactions: [],
      },
    }
  }
}
