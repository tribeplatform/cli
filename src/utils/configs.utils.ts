import { access, constants, readFile, stat, writeFile } from 'fs-extra'
import { RC_LOCATION } from '../constants'
import { Configs } from '../types'
import { NoAccessToConfigError, UnAuthorizedError } from './error.utils'

let VALIDATED = false
let CACHED_CONFIG: Configs

export const isConfigExists = async (): Promise<boolean> => {
  if (CACHED_CONFIG) return true

  try {
    const result = await stat(RC_LOCATION)
    console.log('shit', result)
    return result.isFile()
  } catch {
    return false
  }
}

export const hasAccessToConfig = async (): Promise<boolean> => {
  if (CACHED_CONFIG) return true

  try {
    await access(RC_LOCATION, constants.W_OK | constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

export const validateConfigs = async (): Promise<void> => {
  if (VALIDATED) return

  const hasConfig = await isConfigExists()
  if (!hasConfig) {
    throw new UnAuthorizedError()
  }

  const hasAccess = await hasAccessToConfig()
  if (!hasAccess) {
    throw new NoAccessToConfigError()
  }

  VALIDATED = true
}

export const getConfigs = async (): Promise<Configs> => {
  if (CACHED_CONFIG) return CACHED_CONFIG

  await validateConfigs()

  const data = await readFile(RC_LOCATION, 'utf8')
  const rows = data.split('\n')
  const rc: Record<string, string> = {}
  rows.forEach(row => {
    const separatorIndex = row.indexOf('=')
    if (separatorIndex > 0) {
      const key = row.slice(0, separatorIndex).trim()
      const value = row.slice(separatorIndex + 1).trim()
      rc[key] = value
    }
  })
  return rc as Configs
}

export const setConfigs = async (configs: Configs): Promise<void> => {
  await validateConfigs()

  const data = Object.entries(configs)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
  await writeFile(RC_LOCATION, data, { encoding: 'utf8', flag: 'w+' })
  CACHED_CONFIG = configs
}
