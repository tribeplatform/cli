import { join } from 'path'
import { LOCAL_RC_BLOCKS_FILE_NAME } from '../../constants'
import { BlocksConfigs } from '../../types'
import { readJsonFile, writeJsonFile } from '../file.utils'
import { validateConfigFile } from './base.utils'

export const getBlocks = async (basePath: string): Promise<BlocksConfigs> => {
  const path = join(basePath, LOCAL_RC_BLOCKS_FILE_NAME)
  await validateConfigFile(path)

  const configs = await readJsonFile<BlocksConfigs>(path)
  return configs || {}
}

export const setBlocks = async (
  configs: BlocksConfigs | undefined,
  basePath: string,
): Promise<void> => {
  if (!configs) return

  const path = join(basePath, LOCAL_RC_BLOCKS_FILE_NAME)
  await validateConfigFile(path)

  await writeJsonFile(path, configs)
}
