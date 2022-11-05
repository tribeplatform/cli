import { join } from 'path'
import { LOCAL_RC_CONFIG_FILE_NAME } from '../../constants'
import { BlocksConfigs, LocalConfigs } from '../../types'
import { readJsonFile, writeJsonFile } from '../file.utils'
import { validateConfigFile } from './base.utils'

export const getAppConfigs = async (basePath: string): Promise<BlocksConfigs> => {
  const path = join(basePath, LOCAL_RC_CONFIG_FILE_NAME)
  await validateConfigFile(path)

  const configs = await readJsonFile<BlocksConfigs>(path)
  return configs || {}
}

export const setAppConfigs = async (
  configs: LocalConfigs['configs'] | undefined,
  basePath: string,
): Promise<void> => {
  if (!configs) return

  const path = join(basePath, LOCAL_RC_CONFIG_FILE_NAME)
  await validateConfigFile(path)

  await writeJsonFile(path, configs)
}
