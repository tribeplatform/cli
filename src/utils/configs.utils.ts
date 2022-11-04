import { join } from 'path'
import {
  DEV_POSTFIX,
  GLOBAL_RC_LOCATION,
  LOCAL_RC_CONFIG_FILE_FORMAT,
  LOCAL_RC_CONFIG_FILE_NAME,
  LOCAL_RC_FOLDER_NAME,
} from '../constants'
import { GlobalConfigs, LocalConfigs } from '../types'
import { NoAccessToConfigError } from './error.utils'
import { hasAccessToFile, isFileExists, readJsonFile, writeJsonFile } from './file.utils'

const CACHED_CONFIGS = {
  global: {
    dev: null as GlobalConfigs | null,
    prod: null as GlobalConfigs | null,
  },
  local: {
    dev: null as LocalConfigs | null,
    prod: null as LocalConfigs | null,
  },
}

const getCachedConfigs = (options: {
  global: boolean
  dev: boolean
}): GlobalConfigs | LocalConfigs | null =>
  CACHED_CONFIGS[options.global ? 'global' : 'local'][options.dev ? 'dev' : 'prod']

const setCachedConfigs = (
  configs: GlobalConfigs | LocalConfigs,
  options: {
    global: boolean
    dev: boolean
  },
): void => {
  CACHED_CONFIGS[options.global ? 'global' : 'local'][options.dev ? 'dev' : 'prod'] =
    configs
}

export const getLocalConfigFileRelativePath = (dev: boolean): string => {
  const devPostfix = dev ? DEV_POSTFIX : ''
  return join(
    LOCAL_RC_FOLDER_NAME,
    LOCAL_RC_CONFIG_FILE_NAME + devPostfix + LOCAL_RC_CONFIG_FILE_FORMAT,
  )
}

const getConfigFilePath = (options: { global: boolean; dev: boolean }): string => {
  const { global, dev } = options

  const devPostfix = dev ? DEV_POSTFIX : ''
  const basePath = global
    ? join(GLOBAL_RC_LOCATION, devPostfix)
    : join(process.cwd(), getLocalConfigFileRelativePath(dev))

  return basePath
}

const validateConfigFile = async (path: string): Promise<void> => {
  const fileExists = await isFileExists(path)
  const hasAccess = fileExists && (await hasAccessToFile(path))
  if (fileExists && !hasAccess) {
    throw new NoAccessToConfigError(path)
  }
}

export const getConfigs = async (options: {
  global: boolean
  dev: boolean
}): Promise<GlobalConfigs | LocalConfigs> => {
  const { global, dev } = options

  const cachedConfig = getCachedConfigs({ global, dev })
  if (cachedConfig) return cachedConfig

  const path = getConfigFilePath({ global, dev })
  await validateConfigFile(path)

  const configs = await readJsonFile<GlobalConfigs | LocalConfigs>(path)
  setCachedConfigs(configs || {}, { global, dev })
  return configs || {}
}

export const getLocalConfigs = async (dev = false): Promise<LocalConfigs> =>
  getConfigs({ global: false, dev }) as LocalConfigs

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
  setCachedConfigs(configs || {}, { global, dev })
}

export const setLocalConfigs = async (
  configs: LocalConfigs,
  options: { dev: boolean },
): Promise<void> => setConfigs(configs, { ...options, global: false })

export const setGlobalConfigs = async (
  configs: GlobalConfigs,
  options: { dev: boolean },
): Promise<void> => setConfigs(configs, { ...options, global: true })
