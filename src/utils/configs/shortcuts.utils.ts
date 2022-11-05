import {
  LOCAL_RC_SHORTCUTS_FILE_FORMAT,
  LOCAL_RC_SHORTCUTS_FILE_NAME,
} from '../../constants'
import { ShortcutConfigs } from '../../types'
import { readJsonFile, writeJsonFile } from '../file.utils'
import { getLocalFileRelativePath, validateConfigFile } from './base.utils'

export const getShortcuts = async (dev: boolean): Promise<ShortcutConfigs[]> => {
  const path = getLocalFileRelativePath({
    dev,
    fileName: LOCAL_RC_SHORTCUTS_FILE_NAME,
    fileFormat: LOCAL_RC_SHORTCUTS_FILE_FORMAT,
  })
  await validateConfigFile(path)

  const configs = await readJsonFile<ShortcutConfigs[]>(path)
  return configs || []
}

export const setShortcuts = async (
  configs: ShortcutConfigs[] | undefined,
  options: { dev: boolean },
): Promise<void> => {
  if (!configs) return

  const { dev } = options
  const path = getLocalFileRelativePath({
    dev,
    fileName: LOCAL_RC_SHORTCUTS_FILE_NAME,
    fileFormat: LOCAL_RC_SHORTCUTS_FILE_FORMAT,
  })
  await validateConfigFile(path)

  await writeJsonFile(path, configs)
}
