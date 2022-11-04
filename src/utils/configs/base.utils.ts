import { join } from 'path'
import {
  DEV_POSTFIX,
  GLOBAL_RC_LOCATION,
  LOCAL_RC_CONFIG_FILE_FORMAT,
  LOCAL_RC_CONFIG_FILE_NAME,
  LOCAL_RC_FOLDER_NAME,
} from '../../constants'
import { NoAccessToConfigError } from '../error.utils'
import { hasAccessToFile, isFileExists } from '../file.utils'

export const getLocalConfigFileRelativePath = (dev: boolean): string => {
  const devPostfix = dev ? DEV_POSTFIX : ''
  return join(
    LOCAL_RC_FOLDER_NAME,
    LOCAL_RC_CONFIG_FILE_NAME + devPostfix + LOCAL_RC_CONFIG_FILE_FORMAT,
  )
}

export const getConfigFilePath = (options: { global: boolean; dev: boolean }): string => {
  const { global, dev } = options

  const devPostfix = dev ? DEV_POSTFIX : ''
  const basePath = global
    ? GLOBAL_RC_LOCATION + devPostfix
    : join(process.cwd(), getLocalConfigFileRelativePath(dev))

  return basePath
}

export const validateConfigFile = async (path: string): Promise<void> => {
  const fileExists = await isFileExists(path)
  const hasAccess = fileExists && (await hasAccessToFile(path))
  if (fileExists && !hasAccess) {
    throw new NoAccessToConfigError(path)
  }
}
