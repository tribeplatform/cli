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
import { getNetworkClient, logger } from '@utils'

export class WebhookService {
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
    } catch (e) {
      logger.error('GQL Client Error', e)
      return getServiceUnavailableError(webhook)
    }

    try {
      await NetworkRepository.upsert({
        networkId: network.id,
        name: network.name,
        domain: network.domain,
        graphqlUrl,
      })
    } catch (e) {
      logger.error('Database Error', e)
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
    } catch (e) {
      logger.error('Database Error', e)
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
    // TODO: Handle subscription webhooks here

    return {
      type: webhook.type,
      status: WebhookStatus.Succeeded,
    }
  }

  async handleFederatedSearchWebhook(
    webhook: FederatedSearchWebhook,
  ): Promise<FederatedSearchWebhookResponse> {
    // TODO: Handle federated search webhook here

    return {
      type: webhook.type,
      status: WebhookStatus.Succeeded,
      data: [],
    }
  }

  async handleInteractionWebhook(
    webhook: InteractionWebhook,
  ): Promise<InteractionWebhookResponse> {
    // TODO: Handle interaction webhook here

    return {
      type: webhook.type,
      status: WebhookStatus.Succeeded,
      data: {
        interactions: [],
      },
    }
  }
}
