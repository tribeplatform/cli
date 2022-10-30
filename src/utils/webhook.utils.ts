import { WebhookInputDto } from '@dtos'
import { WebhookType } from '@enums'
import {
  AppInstallation,
  Challenge,
  Event,
  FederatedSearch,
  Interaction,
} from '@interfaces'

export const isTestWebhook = (
  webhook: WebhookInputDto,
): webhook is WebhookInputDto<Challenge> => {
  return webhook.type === WebhookType.Test
}

export const isAppInstalledWebhook = (
  webhook: WebhookInputDto,
): webhook is WebhookInputDto<AppInstallation> => {
  return webhook.type === WebhookType.AppInstalled
}

export const isAppUnInstalledWebhook = (
  webhook: WebhookInputDto,
): webhook is WebhookInputDto<AppInstallation> => {
  return webhook.type === WebhookType.AppUninstalled
}

export const isInteractionWebhook = (
  webhook: WebhookInputDto,
): webhook is WebhookInputDto<Interaction> => {
  return webhook.type === WebhookType.Interaction
}

export const isFederatedSearchWebhook = (
  webhook: WebhookInputDto,
): webhook is WebhookInputDto<FederatedSearch> => {
  return webhook.type === WebhookType.FederatedSearch
}

export const isSubscriptionWebhook = (
  webhook: WebhookInputDto,
): webhook is WebhookInputDto<Event> => {
  return webhook.type === WebhookType.Subscription
}
