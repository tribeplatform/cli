import { EventVerb } from '@enums'
import { SubscriptionWebhook } from '@interfaces'
import { Network } from '@tribeplatform/gql-client/types'
import { Logger } from '@utils'

import { handleNetworkUpdatedSubscription } from './updated.logics'

const logger = new Logger(`NetworkSubscription`)

export const handleNetworkSubscription = async (
  webhook: SubscriptionWebhook<Network>,
): Promise<void> => {
  logger.debug('handleNetworkSubscription called', { webhook })

  const {
    data: { verb },
  } = webhook

  switch (verb) {
    case EventVerb.Updated:
      await handleNetworkUpdatedSubscription(webhook)
      break
    default:
      break
  }
}
