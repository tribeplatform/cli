import { SubscriptionWebhook } from '@interfaces'
import { NetworkRepository } from '@repositories'
import { Network } from '@tribeplatform/gql-client/types'
import { Logger } from '@utils'

const logger = new Logger(`NetworkSubscription`)

export const handleNetworkUpdatedSubscription = async (
  webhook: SubscriptionWebhook<Network>,
): Promise<void> => {
  logger.verbose('handleNetworkUpdatedSubscription called', { webhook })

  const {
    data: {
      object: { id, name, domain },
    },
  } = webhook

  await NetworkRepository.update(id, { name, domain })
}
