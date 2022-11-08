import { join } from 'path'
import { LOCAL_RC_BLOCKS_FILE_NAME } from '../../constants'
import { BlocksConfigs } from '../../types'
import { readJsonFile, validateAccessToFile, writeJsonFile } from '../file.utils'

export const getAppBlocksConfigs = async (
  basePath: string,
): Promise<BlocksConfigs | undefined> => {
  const path = join(basePath, LOCAL_RC_BLOCKS_FILE_NAME)
  await validateAccessToFile(path)

  const configs = await readJsonFile<BlocksConfigs>(path)
  return configs
}

export const setAppBlocksConfigs = async (
  configs: BlocksConfigs | undefined,
  basePath: string,
): Promise<void> => {
  if (!configs) return

  const path = join(basePath, LOCAL_RC_BLOCKS_FILE_NAME)
  await validateAccessToFile(path)

  await writeJsonFile(path, configs)
}
