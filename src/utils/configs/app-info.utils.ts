import { join } from 'path'
import { LOCAL_RC_INFO_FILE_NAME } from '../../constants'
import { AppInfo } from '../../types'
import { readJsonFile, validateAccessToFile, writeJsonFile } from '../file.utils'

export const getAppInfo = async (basePath: string): Promise<AppInfo | undefined> => {
  const path = join(basePath, LOCAL_RC_INFO_FILE_NAME)
  await validateAccessToFile(path)

  const configs = await readJsonFile<AppInfo>(path)
  return configs
}

export const setAppInfo = async (
  configs: AppInfo | undefined,
  basePath: string,
): Promise<void> => {
  if (!configs) return

  const path = join(basePath, LOCAL_RC_INFO_FILE_NAME)
  await validateAccessToFile(path)

  await writeJsonFile(path, configs)
}
