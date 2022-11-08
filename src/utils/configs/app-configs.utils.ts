import { join } from 'path'
import { LOCAL_RC_CONFIG_FILE_NAME } from '../../constants'
import { AppConfigs } from '../../types'
import { readJsonFile, validateAccessToFile, writeJsonFile } from '../file.utils'

export const getAppConfigs = async (
  basePath: string,
): Promise<AppConfigs | undefined> => {
  const path = join(basePath, LOCAL_RC_CONFIG_FILE_NAME)
  await validateAccessToFile(path)

  const configs = await readJsonFile<AppConfigs>(path)
  return configs
}

export const setAppConfigs = async (
  configs: AppConfigs | undefined,
  basePath: string,
): Promise<void> => {
  if (!configs) return

  const path = join(basePath, LOCAL_RC_CONFIG_FILE_NAME)
  await validateAccessToFile(path)

  await writeJsonFile(path, configs)
}
