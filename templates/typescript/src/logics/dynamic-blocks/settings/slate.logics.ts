import { join } from 'path'

import { NetworkSettings, ToastStatus } from '@prisma/client'
import { LiquidConvertor } from '@tribeplatform/slate-kit/convertors'
import { SlateDto } from '@tribeplatform/slate-kit/dtos'
import { Logger } from '@utils'
import { readFile } from 'fs-extra'

const logger = new Logger(`DynamicBlock/Settings/SlateLogics`)

export const getNetworkSettingsSlate = async (
  settings: NetworkSettings,
): Promise<SlateDto> => {
  logger.verbose('getNetworkSettingsSlate called', { settings })

  const liquid = await readFile(
    join(__dirname, 'slates', 'network.settings.liquid'),
    'utf8',
  )
  const convertor = new LiquidConvertor(liquid)
  const cleanSettings: NetworkSettings = { toastStatus: ToastStatus.INFO, ...settings }
  const slate = await convertor.toSlate({
    variables: {
      toastStatuses: JSON.stringify([
        { value: ToastStatus.SUCCESS, text: 'Success' },
        { value: ToastStatus.ERROR, text: 'Error' },
        { value: ToastStatus.WARNING, text: 'Warning' },
        { value: ToastStatus.INFO, text: 'Info' },
        { value: ToastStatus.NEUTRAL, text: 'Neutral' },
      ]),
      settings: cleanSettings,
      jsonSettings: JSON.stringify(cleanSettings),
    },
  })
  return slate
}

export const getNetworkSettingsModalSlate = async (
  settings: NetworkSettings,
): Promise<SlateDto> => {
  logger.verbose('getNetworkSettingsModalSlate called', { settings })

  const liquid = await readFile(
    join(__dirname, 'slates', 'network-modal.settings.liquid'),
    'utf8',
  )
  const convertor = new LiquidConvertor(liquid)
  const cleanSettings: NetworkSettings = { toastStatus: ToastStatus.INFO, ...settings }
  const slate = await convertor.toSlate({
    variables: {
      toastStatuses: JSON.stringify([
        { value: ToastStatus.SUCCESS, text: 'Success' },
        { value: ToastStatus.ERROR, text: 'Error' },
        { value: ToastStatus.WARNING, text: 'Warning' },
        { value: ToastStatus.INFO, text: 'Info' },
        { value: ToastStatus.NEUTRAL, text: 'Neutral' },
      ]),
      jsonSettings: JSON.stringify(cleanSettings),
    },
  })
  return slate
}
