import { access, constants, readFile, stat, writeFile } from 'fs-extra'

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
  const data = await readFile(path, 'utf8')
  try {
    return JSON.parse(data)
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
  await writeFile(path, JSON.stringify(data), { encoding: 'utf8', flag: 'w+' })
}
