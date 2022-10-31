import { WebhookStatus } from '@enums'
import {
  AppInstalledWebhook,
  AppUninstalledWebhook,
  GeneralWebhookResponse,
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
    logger.verbose('Received test webhook', webhook)

    return getChallengeResponse(webhook)
  }

  async handleInstalledWebhook(
    webhook: AppInstalledWebhook,
  ): Promise<GeneralWebhookResponse> {
    logger.verbose('Received app installed webhook', webhook)

    let network: Network
    try {
      const client = await getNetworkClient(webhook.networkId)
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
    logger.verbose('Received app uninstalled webhook', webhook)

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
    logger.verbose('Received subscription webhook', webhook)

    // TODO: Handle subscription webhooks here

    return {
      type: webhook.type,
      status: WebhookStatus.Succeeded,
    }
  }
}
