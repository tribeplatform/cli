import { GlobalConfigs, LocalConfigs } from '../../types'
import { readJsonFile, writeJsonFile } from '../file.utils'
import { getConfigFilePath, validateConfigFile } from './base.utils'
import { getCustomCodes, setCustomCodes } from './custom-codes.utils'

export const getConfigs = async (options: {
  global: boolean
  dev: boolean
}): Promise<GlobalConfigs | LocalConfigs> => {
  const { global, dev } = options

  const path = getConfigFilePath({ global, dev })
  await validateConfigFile(path)

  const configs = await readJsonFile<GlobalConfigs | LocalConfigs>(path)
  return configs || {}
}

export const getLocalConfigs = async (dev = false): Promise<LocalConfigs> => {
  const configs = (await getConfigs({ global: false, dev })) as LocalConfigs
  return {
    ...configs,
    customCodes: await getCustomCodes(dev),
  }
}

export const getGlobalConfigs = async (dev = false): Promise<GlobalConfigs> =>
  getConfigs({ global: true, dev }) as GlobalConfigs

export const setConfigs = async (
  configs: GlobalConfigs | LocalConfigs,
  options: { global: boolean; dev: boolean },
): Promise<void> => {
  const { global, dev } = options

  const path = getConfigFilePath({ global, dev })
  await validateConfigFile(path)

  await writeJsonFile(path, configs)
}

export const setLocalConfigs = async (
  configs: LocalConfigs,
  options: { dev: boolean },
): Promise<void> => {
  const { customCodes, ...restConfigs } = configs
  await setCustomCodes(customCodes, options)
  await setConfigs(restConfigs, { ...options, global: false })
}

export const setGlobalConfigs = async (
  configs: GlobalConfigs,
  options: { dev: boolean },
): Promise<void> => setConfigs(configs, { ...options, global: true })
