export * from './index.controller'
export * from './webhook.controller'

import { BettermodeOAuthController } from './bettermode-oauth.controller'
import { IndexController } from './index.controller'
import { WebhookController } from './webhook.controller'

export default [IndexController, WebhookController, BettermodeOAuthController]
