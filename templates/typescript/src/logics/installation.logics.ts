import { WebhookStatus } from '@enums'
import {
  AppInstalledWebhook,
  AppUninstalledWebhook,
  GeneralWebhookResponse,
} from '@interfaces'
import { NetworkRepository } from '@repositories'

import { globalLogger } from '@utils'
import { getServiceUnavailableError } from './error.logics'

const logger = globalLogger.setContext(`InstallationWebhook`)

export const handleInstalledWebhook = async (
  webhook: AppInstalledWebhook,
): Promise<GeneralWebhookResponse> => {
  logger.debug('handleInstalledWebhook called', { webhook })

  const {
    data: {
      networkInfo: { id: networkId, name, domain, graphqlUrl },
    },
  } = webhook

  try {
    await NetworkRepository.delete(networkId)
    // eslint-disable-next-line no-empty
  } catch {}

  try {
    await NetworkRepository.create({
      networkId,
      name,
      domain,
      graphqlUrl,
    })
  } catch (error) {
    logger.error(error)
    return getServiceUnavailableError(webhook)
  }

  return {
    type: webhook.type,
    status: WebhookStatus.Succeeded,
  }
}

export const handleUninstalledWebhook = async (
  webhook: AppUninstalledWebhook,
): Promise<GeneralWebhookResponse> => {
  logger.debug('handleUninstalledWebhook called', { webhook })

  try {
    await NetworkRepository.delete(webhook.networkId)
  } catch (error) {
    logger.error(error)
    return getServiceUnavailableError(webhook)
  }

  return {
    type: webhook.type,
    status: WebhookStatus.Succeeded,
  }
}
