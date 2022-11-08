import { App } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../../better-command'
import { getUpdateAppTasks } from '../../logics'
import { NoAppConfigError, UnAuthorizedError } from '../../utils'

type UpdateAppResponse = App

export default class UpdateApp extends BetterCommand<UpdateAppResponse> {
  static description = 'update app configs'

  static examples = [`$ bettermode app update`]

  async run(): Promise<UpdateAppResponse> {
    const { officialPartner = false } = await this.getGlobalConfigs()
    const localConfigs = await this.getLocalConfigs()
    const client = await this.getClient()

    if (!client) {
      throw new UnAuthorizedError()
    }

    if (!localConfigs.info?.id) {
      throw new NoAppConfigError()
    }

    const tasks = getUpdateAppTasks({ client, localConfigs, officialPartner })
    const { app } = await tasks.run()

    this.logSuccess(`You have successfully updated your app's config!`)
    return app
  }
}
