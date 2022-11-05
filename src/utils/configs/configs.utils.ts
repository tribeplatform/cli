import { OFFICIAL_PARTNER_EMAILS } from '../../constants'
import { GlobalConfigs, LocalConfigs } from '../../types'
import { readJsonFile, writeJsonFile } from '../file.utils'
import { getAppConfigs, setAppConfigs } from './app-configs.utils'
import {
  getConfigFilePath,
  getLocalFileRelativePath,
  validateConfigFile,
} from './base.utils'
import { getBlocks, setBlocks } from './blocks.utils'
import { getCustomCodes, setCustomCodes } from './custom-codes.utils'
import { getShortcuts, setShortcuts } from './shortcuts.utils'

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

export const getLocalDetailConfigs = async (options: {
  basePath: string
  key: string
  getter: (basePath: string) => unknown
}): Promise<LocalConfigs> => {
  try {
    const { basePath, key, getter } = options
    return {
      [key]: await getter(basePath),
    }
  } catch {
    return {}
  }
}

export const getLocalConfigs = async (dev = false): Promise<LocalConfigs> => {
  const basePath = getLocalFileRelativePath(dev)

  const result = await Promise.all([
    getConfigs({ global: false, dev }) as Promise<LocalConfigs>,
    getLocalDetailConfigs({ basePath, key: 'configs', getter: getAppConfigs }),
    getLocalDetailConfigs({ basePath, key: 'customCodes', getter: getCustomCodes }),
    getLocalDetailConfigs({ basePath, key: 'blocks', getter: getBlocks }),
    getLocalDetailConfigs({ basePath, key: 'shortcuts', getter: getShortcuts }),
  ])
  return Object.assign(...result)
}

export const getGlobalConfigs = async (dev = false): Promise<GlobalConfigs> => {
  const result = (await getConfigs({ global: true, dev })) as GlobalConfigs
  return {
    ...result,
    officialPartner: OFFICIAL_PARTNER_EMAILS.some(officialEmail =>
      result?.email?.includes(officialEmail),
    ),
  }
}

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
  const { configs: appConfigs, customCodes, blocks, shortcuts, ...restConfigs } = configs
  const basePath = getLocalFileRelativePath(options.dev)

  await Promise.all([
    setConfigs(restConfigs, { ...options, global: false }),
    setAppConfigs(appConfigs, basePath),
    setCustomCodes(customCodes, basePath),
    setBlocks(blocks, basePath),
    setShortcuts(shortcuts, basePath),
  ])
}

export const setGlobalConfigs = async (
  configs: GlobalConfigs,
  options: { dev: boolean },
): Promise<void> => setConfigs(configs, { ...options, global: true })
