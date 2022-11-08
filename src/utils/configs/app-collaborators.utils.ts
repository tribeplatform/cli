import { join } from 'path'
import { LOCAL_RC_COLLABORATOR_FILE_NAME } from '../../constants'
import { CollaboratorConfigs } from '../../types'
import { readJsonFile, validateAccessToFile, writeJsonFile } from '../file.utils'

export const getAppCollaboratorsConfigs = async (
  basePath: string,
): Promise<CollaboratorConfigs | undefined> => {
  const path = join(basePath, LOCAL_RC_COLLABORATOR_FILE_NAME)
  await validateAccessToFile(path)

  const configs = await readJsonFile<CollaboratorConfigs>(path)
  return configs
}

export const setAppCollaboratorsConfigs = async (
  configs: CollaboratorConfigs | undefined,
  basePath: string,
): Promise<void> => {
  if (!configs) return

  const path = join(basePath, LOCAL_RC_COLLABORATOR_FILE_NAME)
  await validateAccessToFile(path)

  await writeJsonFile(path, configs)
}
