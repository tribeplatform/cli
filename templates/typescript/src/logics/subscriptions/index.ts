import { ErrorCode, WebhookStatus } from '@enums'
import { GeneralWebhookResponse, SubscriptionWebhook } from '@interfaces'
import { EventNoun } from '@tribeplatform/gql-client/global-types'
import { Network } from '@tribeplatform/gql-client/types'

import { globalLogger } from '@utils'
import { handleNetworkSubscription } from './network'

const logger = globalLogger.setContext(`Subscription`)

export const handleSubscriptionWebhook = async (
  webhook: SubscriptionWebhook,
): Promise<GeneralWebhookResponse> => {
  logger.debug('handleSubscriptionWebhook called', { webhook })

  const {
    data: { noun },
  } = webhook

  try {
    switch (noun) {
      case EventNoun.NETWORK:
        await handleNetworkSubscription(webhook as SubscriptionWebhook<Network>)
        break
      default:
        break
    }
  } catch (error) {
    logger.error(error)
    return {
      type: webhook.type,
      status: WebhookStatus.Failed,
      errorCode: error.code || ErrorCode.ServerError,
      errorMessage: error.message,
    }
  }

  return {
    type: webhook.type,
    status: WebhookStatus.Succeeded,
  }
}
