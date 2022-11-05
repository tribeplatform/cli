import { join } from 'path'
import { LOCAL_RC_SHORTCUTS_FILE_NAME } from '../../constants'
import { ShortcutConfigs } from '../../types'
import { readJsonFile, writeJsonFile } from '../file.utils'
import { validateConfigFile } from './base.utils'

export const getShortcuts = async (basePath: string): Promise<ShortcutConfigs[]> => {
  const path = join(basePath, LOCAL_RC_SHORTCUTS_FILE_NAME)
  await validateConfigFile(path)

  const configs = await readJsonFile<ShortcutConfigs[]>(path)
  return configs || []
}

export const setShortcuts = async (
  configs: ShortcutConfigs[] | undefined,
  basePath: string,
): Promise<void> => {
  if (!configs) return

  const path = join(basePath, LOCAL_RC_SHORTCUTS_FILE_NAME)
  await validateConfigFile(path)

  await writeJsonFile(path, configs)
}
