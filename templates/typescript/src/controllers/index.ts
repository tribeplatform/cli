import { BettermodeOAuthController } from './bettermode-oauth.controller'
import { IndexController } from './index.controller'
import { WebhookController } from './webhook.controller'

export * from './index.controller'
export * from './webhook.controller'

const defaultControllers = [IndexController, WebhookController, BettermodeOAuthController]

export default defaultControllers
