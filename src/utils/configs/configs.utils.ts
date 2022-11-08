import { join } from 'path'
import {
  GLOBAL_RC_DEV_POSTFIX,
  GLOBAL_RC_LOCATION,
  LOCAL_RC_DEV_FOLDER_NAME,
  LOCAL_RC_FOLDER_NAME,
  OFFICIAL_PARTNER_EMAILS,
} from '../../constants'
import { GlobalConfigs, LocalConfigs } from '../../types'
import { readJsonFile, validateAccessToFile, writeJsonFile } from '../file.utils'
import { getAppBlocksConfigs, setAppBlocksConfigs } from './app-blocks.utils'
import {
  getAppCollaboratorsConfigs,
  setAppCollaboratorsConfigs,
} from './app-collaborators.utils'
import { getAppConfigs, setAppConfigs } from './app-configs.utils'
import {
  getAppCustomCodesConfigs,
  setAppCustomCodesConfigs,
} from './app-custom-codes.utils'
import { getAppInfo, setAppInfo } from './app-info.utils'
import { getAppShortcutsConfigs, setAppShortcutsConfigs } from './app-shortcuts.utils'

export const getGlobalConfigFilePath = (dev: boolean): string => {
  const devPostfix = dev ? GLOBAL_RC_DEV_POSTFIX : ''
  return GLOBAL_RC_LOCATION + devPostfix
}

export const getLocalFileRelativePath = (dev: boolean): string => {
  if (dev) {
    return join(LOCAL_RC_FOLDER_NAME, LOCAL_RC_DEV_FOLDER_NAME)
  }

  return LOCAL_RC_FOLDER_NAME
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
    getLocalDetailConfigs({ basePath, key: 'info', getter: getAppInfo }),
    getLocalDetailConfigs({ basePath, key: 'configs', getter: getAppConfigs }),
    getLocalDetailConfigs({
      basePath,
      key: 'collaborators',
      getter: getAppCollaboratorsConfigs,
    }),
    getLocalDetailConfigs({
      basePath,
      key: 'customCodes',
      getter: getAppCustomCodesConfigs,
    }),
    getLocalDetailConfigs({ basePath, key: 'blocks', getter: getAppBlocksConfigs }),
    getLocalDetailConfigs({ basePath, key: 'shortcuts', getter: getAppShortcutsConfigs }),
  ])
  return Object.assign(...result)
}

export const getGlobalConfigs = async (dev = false): Promise<GlobalConfigs> => {
  const path = getGlobalConfigFilePath(dev)
  await validateAccessToFile(path)

  const configs = await readJsonFile<GlobalConfigs>(path)
  const result = configs || {}
  return {
    ...result,
    officialPartner: OFFICIAL_PARTNER_EMAILS.some(officialEmail =>
      result?.email?.includes(officialEmail),
    ),
  }
}

export const setLocalConfigs = async (
  configs: LocalConfigs,
  options: { dev: boolean; cwd?: string },
): Promise<void> => {
  const {
    info,
    configs: appConfigs,
    collaborators,
    customCodes,
    blocks,
    shortcuts,
  } = configs
  const { dev, cwd } = options

  let basePath = getLocalFileRelativePath(dev)
  if (cwd) {
    basePath = join(cwd, basePath)
  }

  await Promise.all([
    setAppInfo(info, basePath),
    setAppConfigs(appConfigs, basePath),
    setAppCollaboratorsConfigs(collaborators, basePath),
    setAppCustomCodesConfigs(customCodes, basePath),
    setAppBlocksConfigs(blocks, basePath),
    setAppShortcutsConfigs(shortcuts, basePath),
  ])
}

export const setGlobalConfigs = async (
  configs: GlobalConfigs,
  options: { dev: boolean },
): Promise<void> => {
  const { dev } = options

  const path = getGlobalConfigFilePath(dev)
  await validateAccessToFile(path)

  await writeJsonFile(path, configs)
}
