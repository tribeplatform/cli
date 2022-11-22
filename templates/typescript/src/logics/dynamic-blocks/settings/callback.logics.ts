import { InteractionType, WebhookStatus, WebhookType } from '@enums'
import { InteractionInput, InteractionWebhookResponse } from '@interfaces'
import { Network, NetworkSettings, ToastStatus } from '@prisma/client'
import { NetworkRepository } from '@repositories'
import { PermissionContext } from '@tribeplatform/gql-client/types'
import { Logger } from '@utils'

import { getInteractionNotSupportedError } from '../../error.logics'

import { getNetworkSettingsModalSlate, getNetworkSettingsSlate } from './slate.logics'

const logger = new Logger(`DynamicBlock/Settings/CallbackLogics`)

const getSaveCallbackResponse = async (options: {
  network: Network
  data: InteractionInput<NetworkSettings>
}): Promise<InteractionWebhookResponse> => {
  logger.verbose('getNetworkSettingsInteractionCallbackResponse called', { options })

  const {
    network,
    data: { interactionId, inputs },
  } = options

  const updatedNetwork = await NetworkRepository.update(network.networkId, {
    settings: inputs,
  })
  return {
    type: WebhookType.Interaction,
    status: WebhookStatus.Succeeded,
    data: {
      interactions: [
        {
          id: interactionId,
          type: InteractionType.Show,
          slate: await getNetworkSettingsSlate(updatedNetwork.settings),
        },
      ],
    },
  }
}

const getModalSaveCallbackResponse = async (options: {
  network: Network
  data: InteractionInput<NetworkSettings>
}): Promise<InteractionWebhookResponse> => {
  logger.verbose('getNetworkSettingsInteractionCallbackResponse called', { options })

  const {
    network,
    data: { interactionId, inputs },
  } = options

  await NetworkRepository.update(network.networkId, {
    settings: inputs,
  })
  return {
    type: WebhookType.Interaction,
    status: WebhookStatus.Succeeded,
    data: {
      interactions: [
        {
          id: interactionId,
          type: InteractionType.Close,
        },
        {
          id: 'reload',
          type: InteractionType.Reload,
          props: {
            entity: PermissionContext.NETWORK,
          },
        },
      ],
    },
  }
}

const getOpenModalCallbackResponse = async (options: {
  network: Network
  data: InteractionInput<NetworkSettings>
}): Promise<InteractionWebhookResponse> => ({
  type: WebhookType.Interaction,
  status: WebhookStatus.Succeeded,
  data: {
    interactions: [
      {
        id: options.data.interactionId,
        type: InteractionType.OpenModal,
        slate: await getNetworkSettingsModalSlate(options.network.settings),
        props: {
          size: 'lg',
          title: 'Update configs',
          description: 'Update your configs by changing the values below',
        },
      },
    ],
  },
})

const getOpenToastCallbackResponse = async (options: {
  network: Network
  data: InteractionInput<NetworkSettings>
}): Promise<InteractionWebhookResponse> => ({
  type: WebhookType.Interaction,
  status: WebhookStatus.Succeeded,
  data: {
    interactions: [
      {
        id: 'open-toast',
        type: InteractionType.OpenToast,
        props: {
          status: options.network.settings?.toastStatus || ToastStatus.WARNING,
          title:
            options.network.settings?.toastMessage || 'Please set your toast message!',
          description: 'Description goes here',
        },
      },
    ],
  },
})

const getRedirectCallbackResponse = async (options: {
  network: Network
  data: InteractionInput<NetworkSettings>
}): Promise<InteractionWebhookResponse> => ({
  type: WebhookType.Interaction,
  status: WebhookStatus.Succeeded,
  data: {
    interactions: [
      {
        id: 'new-interaction-id',
        type: InteractionType.Redirect,
        props: {
          url: options.network.settings?.redirectionUrl || 'https://bettermode.com',
          external: options.network.settings?.externalRedirect,
        },
      },
    ],
  },
})

export const getCallbackResponse = async (options: {
  network: Network
  data: InteractionInput<NetworkSettings>
}): Promise<InteractionWebhookResponse> => {
  logger.verbose('getCallbackResponse called', { options })

  const {
    data: { callbackId },
  } = options

  switch (callbackId) {
    case 'save':
      return getSaveCallbackResponse(options)
    case 'modal-save':
      return getModalSaveCallbackResponse(options)
    case 'open-modal':
      return getOpenModalCallbackResponse(options)
    case 'open-toast':
      logger.verbose('shit', { shit: await getOpenToastCallbackResponse(options) })
      return getOpenToastCallbackResponse(options)
    case 'redirect':
      return getRedirectCallbackResponse(options)
    default:
      return getInteractionNotSupportedError('callbackId', callbackId)
  }
}
