import { join } from 'path'
import {
  LOCAL_RC_CUSTOM_CODES_FILE_FORMAT,
  LOCAL_RC_CUSTOM_CODES_FOLDER_NAME,
} from '../../constants'
import { CustomCodeConfigs } from '../../types'
import { readFile, writeFile } from '../file.utils'
import { Shell } from '../shell.utils'

export const getAppCustomCodesConfigs = async (
  basePath: string,
): Promise<CustomCodeConfigs | undefined> => {
  const path = join(basePath, LOCAL_RC_CUSTOM_CODES_FOLDER_NAME)
  const files = Shell.findAll({ cwd: path })
  const results = await Promise.all(
    files
      .map(file => ({
        key: file.replace(LOCAL_RC_CUSTOM_CODES_FILE_FORMAT, ''),
        path: join(path, file),
      }))
      .map(async ({ key, path }) => ({ key, value: await readFile(path) })),
  )

  const result = Object.fromEntries(
    results.map(({ key, value }) => [key, value || undefined]),
  )
  if (Object.keys(result).length === 0) return undefined
  return result
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
