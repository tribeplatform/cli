import { LOCAL_RC_BLOCKS_FILE_FORMAT, LOCAL_RC_BLOCKS_FILE_NAME } from '../../constants'
import { BlocksConfigs } from '../../types'
import { readJsonFile, writeJsonFile } from '../file.utils'
import { getLocalFileRelativePath, validateConfigFile } from './base.utils'

export const getBlocks = async (dev: boolean): Promise<BlocksConfigs> => {
  const path = getLocalFileRelativePath({
    dev,
    fileName: LOCAL_RC_BLOCKS_FILE_NAME,
    fileFormat: LOCAL_RC_BLOCKS_FILE_FORMAT,
  })
  await validateConfigFile(path)

  const configs = await readJsonFile<BlocksConfigs>(path)
  return configs || {}
}

export const setBlocks = async (
  configs: BlocksConfigs | undefined,
  options: { dev: boolean },
): Promise<void> => {
  if (!configs) return

  const { dev } = options
  const path = getLocalFileRelativePath({
    dev,
    fileName: LOCAL_RC_BLOCKS_FILE_NAME,
    fileFormat: LOCAL_RC_BLOCKS_FILE_FORMAT,
  })
  await validateConfigFile(path)

  await writeJsonFile(path, configs)
}
