import { join } from 'path'
import {
  LOCAL_RC_CUSTOM_CODES_FILE_FORMAT,
  LOCAL_RC_CUSTOM_CODES_FOLDER_NAME,
} from '../../constants'
import { LocalConfigs } from '../../types'
import { readFile, writeFile } from '../file.utils'
import { Shell } from '../shell.utils'

export const getCustomCodes = async (
  basePath: string,
): Promise<LocalConfigs['customCodes']> => {
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

  return Object.fromEntries(results.map(({ key, value }) => [key, value || undefined]))
}

export const setCustomCodes = async (
  customCodes: LocalConfigs['customCodes'],
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
