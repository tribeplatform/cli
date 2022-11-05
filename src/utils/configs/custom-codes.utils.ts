import { join } from 'path'
import {
  DEV_POSTFIX,
  LOCAL_RC_CUSTOM_CODES_FILE_FORMAT,
  LOCAL_RC_CUSTOM_CODES_FOLDER_NAME,
  LOCAL_RC_FOLDER_NAME,
} from '../../constants'
import { LocalConfigs } from '../../types'
import { readFile, writeFile } from '../file.utils'
import { Shell } from '../shell.utils'

export const getCustomCodes = async (
  dev: boolean,
): Promise<LocalConfigs['customCodes']> => {
  const basePath = join(
    process.cwd(),
    LOCAL_RC_FOLDER_NAME,
    LOCAL_RC_CUSTOM_CODES_FOLDER_NAME,
  )
  const files = Shell.findAll({ cwd: basePath })
  const results = await Promise.all(
    files
      ?.filter(file => dev === file.includes(DEV_POSTFIX))
      .map(file => ({
        key: file.replace(DEV_POSTFIX, '').replace(LOCAL_RC_CUSTOM_CODES_FILE_FORMAT, ''),
        path: join(basePath, file),
      }))
      .map(async ({ key, path }) => ({ key, value: await readFile(path) })),
  )

  return Object.fromEntries(results.map(({ key, value }) => [key, value || undefined]))
}

export const setCustomCodes = async (
  customCodes: LocalConfigs['customCodes'],
  options: { dev: boolean },
): Promise<void> => {
  if (!customCodes) return

  const { dev } = options

  const devPostfix = dev ? DEV_POSTFIX : ''
  await Promise.all(
    Object.entries(customCodes).map(async ([key, value]) => {
      const path = join(
        process.cwd(),
        LOCAL_RC_FOLDER_NAME,
        LOCAL_RC_CUSTOM_CODES_FOLDER_NAME,
        key + devPostfix + LOCAL_RC_CUSTOM_CODES_FILE_FORMAT,
      )
      await writeFile(path, value || '')
    }),
  )
}
