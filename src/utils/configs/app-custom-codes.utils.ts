import { join } from 'path'
import {
  LOCAL_RC_CUSTOM_CODES_FILE_FORMAT,
  LOCAL_RC_CUSTOM_CODES_FOLDER_NAME,
} from '../../constants'
import { CustomCodeConfigs } from '../../types'
import { readFile, writeFile } from '../file.utils'

export const getAppCustomCodesConfigs = async (
  basePath: string,
): Promise<CustomCodeConfigs | undefined> => {
  const path = join(basePath, LOCAL_RC_CUSTOM_CODES_FOLDER_NAME)
  const [head, body] = await Promise.all([
    await readFile(join(path, `head${LOCAL_RC_CUSTOM_CODES_FILE_FORMAT}`)),
    await readFile(join(path, `body${LOCAL_RC_CUSTOM_CODES_FILE_FORMAT}`)),
  ])

  return {
    head: head || null,
    body: body || null,
  }
}

export const setAppCustomCodesConfigs = async (
  customCodes: CustomCodeConfigs | undefined,
  basePath: string,
): Promise<void> => {
  if (!customCodes) return

  await Promise.all(
    Object.entries(customCodes).map(async ([key, value]) => {
      const path = join(
        basePath,
        LOCAL_RC_CUSTOM_CODES_FOLDER_NAME,
        key + LOCAL_RC_CUSTOM_CODES_FILE_FORMAT,
      )
      await writeFile(path, value || '')
    }),
  )
}
