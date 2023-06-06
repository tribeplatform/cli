import { SubscriptionWebhook } from '@interfaces'
import { EventVerb } from '@tribeplatform/gql-client/global-types'
import { Network } from '@tribeplatform/gql-client/types'

import { globalLogger } from '@utils'
import { handleNetworkUpdatedSubscription } from './updated.logics'

const logger = globalLogger.setContext(`NetworkSubscription`)

export const handleNetworkSubscription = async (
  webhook: SubscriptionWebhook<Network>,
): Promise<void> => {
  logger.debug('handleNetworkSubscription called', { webhook })

  const {
    data: { verb },
  } = webhook

  switch (verb) {
    case EventVerb.UPDATED:
      await handleNetworkUpdatedSubscription(webhook)
      break
    default:
      break
  }
}
