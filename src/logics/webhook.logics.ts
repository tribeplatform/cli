import { WebhookStatus, WebhookType } from '@enums'
import { TestWebhook, TestWebhookResponse } from '@interfaces'

export const getChallengeResponse = (webhook: TestWebhook): TestWebhookResponse => ({
  type: WebhookType.Test,
  status: WebhookStatus.Succeeded,
  data: { challenge: webhook.data.challenge },
})
