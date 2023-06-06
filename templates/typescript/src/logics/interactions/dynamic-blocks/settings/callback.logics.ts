import { InteractionType, WebhookStatus, WebhookType } from '@enums'
import { InteractionInput, InteractionWebhookResponse } from '@interfaces'
import { Network, NetworkSettings, ToastStatus } from '@prisma/client'
import { NetworkRepository } from '@repositories'

import { getInteractionNotSupportedError } from '../../../error.logics'

import { globalLogger } from '@utils'
import { SettingsBlockCallback } from './constants'
import { getNetworkSettingsModalSlate, getNetworkSettingsSlate } from './slate.logics'

const logger = globalLogger.setContext(`SettingsDynamicBlock`)

const getSaveCallbackResponse = async (options: {
  network: Network
  data: InteractionInput<NetworkSettings>
}): Promise<InteractionWebhookResponse> => {
  logger.debug('getNetworkSettingsInteractionCallbackResponse called', { options })

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
  logger.debug('getNetworkSettingsInteractionCallbackResponse called', { options })

  const {
    network,
    data: { interactionId, inputs, dynamicBlockKey },
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
            dynamicBlockKeys: [dynamicBlockKey],
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
  logger.debug('getCallbackResponse called', { options })

  const {
    data: { callbackId },
  } = options

  switch (callbackId) {
    case SettingsBlockCallback.Save:
      return getSaveCallbackResponse(options)
    case SettingsBlockCallback.ModalSave:
      return getModalSaveCallbackResponse(options)
    case SettingsBlockCallback.OpenModal:
      return getOpenModalCallbackResponse(options)
    case SettingsBlockCallback.OpenToast:
      return getOpenToastCallbackResponse(options)
    case SettingsBlockCallback.Redirect:
      return getRedirectCallbackResponse(options)
    default:
      return getInteractionNotSupportedError('callbackId', callbackId)
  }
}
