import { access, constants, readFile, stat, writeFile } from 'fs-extra'
import {
  CONFIG_MAPPER,
  OFFICIAL_EMAILS,
  RC_LOCATION,
  REVERSE_CONFIG_MAPPER,
} from '../constants'
import { Configs } from '../types'
import { NoAccessToConfigError, UnAuthorizedError } from './error.utils'

let VALIDATED = false
let CACHED_CONFIG: Configs

let DEV_VALIDATED = false
let DEV_CACHED_CONFIG: Configs

const getRcLocation = (dev = false): string => {
  if (dev) {
    return RC_LOCATION + '.dev'
  }

  return RC_LOCATION
}

const isConfigExists = async (dev = false): Promise<boolean> => {
  try {
    const result = await stat(getRcLocation(dev))
    return result.isFile()
  } catch {
    return false
  }
}

const hasAccessToConfig = async (dev = false): Promise<boolean> => {
  try {
    await access(getRcLocation(dev), constants.W_OK | constants.R_OK)
    return true
  } catch {
    return false
  }
}

const validateConfigs = async (dev = false, ignoreExistence = false): Promise<void> => {
  const validated = dev ? DEV_VALIDATED : VALIDATED
  if (validated) return

  const hasConfig = await isConfigExists(dev)
  if (!hasConfig && !ignoreExistence) {
    throw new UnAuthorizedError()
  } else if (!hasConfig && ignoreExistence) {
    return
  }

  const hasAccess = await hasAccessToConfig(dev)
  if (!hasAccess) {
    throw new NoAccessToConfigError()
  }

  if (dev) {
    DEV_VALIDATED = true
  } else {
    VALIDATED = true
  }
}

export const getConfigs = async (dev = false): Promise<Configs> => {
  const cachedConfig = dev ? DEV_CACHED_CONFIG : CACHED_CONFIG
  if (cachedConfig) return cachedConfig

  await validateConfigs(dev)

  const data = await readFile(getRcLocation(dev), 'utf8')
  const rows = data.split('\n')
  const rc: Record<string, string> = {}
  for (const row of rows) {
    const separatorIndex = row.indexOf('=')
    if (separatorIndex > 0) {
      const key = row.slice(0, separatorIndex).trim()
      const value = row.slice(separatorIndex + 1).trim()
      if (REVERSE_CONFIG_MAPPER[key] && value) {
        rc[REVERSE_CONFIG_MAPPER[key]] = value
      }
    }
  }

  const configs = {
    ...rc,
    official: OFFICIAL_EMAILS.find(email => rc.email?.endsWith(email)),
  } as Configs

  if (dev) {
    DEV_CACHED_CONFIG = configs
  } else {
    CACHED_CONFIG = configs
  }

  return configs
}

export const setConfigs = async (configs: Configs, dev = false): Promise<void> => {
  await validateConfigs(dev, true)

  const data = Object.entries(configs)
    .filter(([key]) => CONFIG_MAPPER[key])
    .map(([key, value]) => `${CONFIG_MAPPER[key]}=${value}`)
    .join('\n')
  await writeFile(getRcLocation(dev), data, { encoding: 'utf8', flag: 'w+' })

  if (dev) {
    DEV_CACHED_CONFIG = configs
  } else {
    CACHED_CONFIG = configs
  }
}
