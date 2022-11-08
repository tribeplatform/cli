import { ListrTask } from 'listr'
import { LocalConfigs } from '../types'
import { CliClient } from '../utils'

export const getUpdateCollaboratorsTasks = (options: {
  client: CliClient
  localConfigs: LocalConfigs
}): ListrTask => {
  const {
    client,
    localConfigs: { info: { id } = {}, collaborators },
  } = options
  const appId = id as string

  return {
    title: 'Update collaborators',
    skip: () => {
      if (collaborators === undefined) {
        return 'No collaborators to update'
      }
    },
    task: async () => {
      const currentCollaborators = await client.query({
        name: 'appCollaborators',
        args: {
          fields: 'basic',
          variables: { appId },
        },
      })

      const collaboratorEmails = new Set(currentCollaborators.map(c => c.email))
      const deletedCollaborators = currentCollaborators.filter(
        ({ email }) => !collaborators?.includes(email),
      )
      const newCollaborators = collaborators?.filter(
        email => !collaboratorEmails.has(email),
      )

      await Promise.all(
        [
          deletedCollaborators.map(({ id }) =>
            client.mutation({
              name: 'removeAppCollaborator',
              args: {
                variables: { appId, collaboratorId: id },
                fields: 'basic',
              },
            }),
          ),
          newCollaborators?.map(email =>
            client.mutation({
              name: 'addAppCollaborator',
              args: {
                variables: { appId, input: { email } },
                fields: 'basic',
              },
            }),
          ),
        ].flat(),
      )
    },
  }
}
