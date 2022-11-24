import {
  access,
  constants,
  mkdir,
  pathExistsSync as fsPathExists,
  readFile as fsReadFile,
  readJson,
  stat,
  writeFile as fsWriteFile,
  writeJson,
} from 'fs-extra'
import { dirname } from 'path'
import { NoAccessToFileError } from './error.utils'

export const isFileExists = async (path: string): Promise<boolean> => {
  try {
    const result = await stat(path)
    return result.isFile()
  } catch {
    return false
  }
}

export const pathExists = (path: string): boolean => {
  try {
    const result = fsPathExists(path)
    return result
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

export const readJsonFile = async <T>(path: string): Promise<T | undefined> => {
  try {
    return await readJson(path, 'utf8')
  } catch {
    return undefined
  }
}

export const readFile = async (path: string): Promise<string | undefined> => {
  try {
    return await fsReadFile(path, 'utf8')
  } catch {
    return undefined
  }
}

export const writeJsonFile = async <T>(path: string, data: T): Promise<void> => {
  await mkdir(dirname(path), { recursive: true })
  await writeJson(path, data, { encoding: 'utf8', flag: 'w+', spaces: 2 })
}

export const writeFile = async (path: string, data: string): Promise<void> => {
  await mkdir(dirname(path), { recursive: true })
  await fsWriteFile(path, data, { encoding: 'utf8', flag: 'w+' })
}

export const validateAccessToFile = async (path: string): Promise<void> => {
  const fileExists = await isFileExists(path)
  const hasAccess = fileExists && (await hasAccessToFile(path))
  if (fileExists && !hasAccess) {
    throw new NoAccessToFileError(path)
  }
}
