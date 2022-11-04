import { access, constants, mkdir, readJson, stat, writeJson } from 'fs-extra'
import { dirname } from 'path'

export const isFileExists = async (path: string): Promise<boolean> => {
  try {
    const result = await stat(path)
    return result.isFile()
  } catch {
    return false
  }
}

export const hasAccessToFile = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.W_OK | constants.R_OK)
    return true
  } catch {
    return false
  }
}

export const readJsonFile = async <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  path: string,
): Promise<T | null> => {
  try {
    return await readJson(path, 'utf8')
  } catch {
    return null
  }
}

export const writeJsonFile = async <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  path: string,
  data: T,
): Promise<void> => {
  await mkdir(dirname(path), { recursive: true })
  await writeJson(path, data, { encoding: 'utf8', flag: 'w+', spaces: 2 })
}
