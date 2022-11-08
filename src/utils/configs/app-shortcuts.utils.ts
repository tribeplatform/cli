import { join } from 'path'
import { LOCAL_RC_SHORTCUTS_FILE_NAME } from '../../constants'
import { ShortcutConfigs } from '../../types'
import { readJsonFile, validateAccessToFile, writeJsonFile } from '../file.utils'

export const getAppShortcutsConfigs = async (
  basePath: string,
): Promise<ShortcutConfigs[] | undefined> => {
  const path = join(basePath, LOCAL_RC_SHORTCUTS_FILE_NAME)
  await validateAccessToFile(path)

  const configs = await readJsonFile<ShortcutConfigs[]>(path)
  return configs
}

export const setAppShortcutsConfigs = async (
  configs: ShortcutConfigs[] | undefined,
  basePath: string,
): Promise<void> => {
  if (!configs) return

  const path = join(basePath, LOCAL_RC_SHORTCUTS_FILE_NAME)
  await validateAccessToFile(path)

  await writeJsonFile(path, configs)
}
