import { join } from 'path'
import {
  GLOBAL_RC_DEV_POSTFIX,
  GLOBAL_RC_LOCATION,
  LOCAL_RC_DEV_FOLDER_NAME,
  LOCAL_RC_FOLDER_NAME,
  LOCAL_RC_INFO_FILE_NAME,
} from '../../constants'
import { NoAccessToConfigError } from '../error.utils'
import { hasAccessToFile, isFileExists } from '../file.utils'

export const getLocalFileRelativePath = (dev: boolean): string => {
  if (dev) {
    return join(LOCAL_RC_FOLDER_NAME, LOCAL_RC_DEV_FOLDER_NAME)
  }

  return LOCAL_RC_FOLDER_NAME
}

export const getLocalConfigFileRelativePath = (dev: boolean): string =>
  join(getLocalFileRelativePath(dev), LOCAL_RC_INFO_FILE_NAME)

export const getConfigFilePath = (options: { global: boolean; dev: boolean }): string => {
  const { global, dev } = options

  const devPostfix = dev ? GLOBAL_RC_DEV_POSTFIX : ''
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
