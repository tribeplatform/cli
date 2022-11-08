import {
  App,
  AppCollaborator,
  DefaultDynamicBlockKeys,
  DynamicBlock,
  Image,
  Shortcut,
} from '@tribeplatform/gql-client/global-types'
import {
  DefaultDynamicBlockConfigs,
  DynamicBlockConfigs,
  LocalConfigs,
  ShortcutConfigs,
} from '../types'

export const appConfigsConverter = (
  app: App,
  collaborators: AppCollaborator[],
): LocalConfigs => ({
  info: {
    id: app.id,
    name: app.name,
    slug: app.slug,
    status: app.status,
    standing: app.standing,
    description: app.description || undefined,
    image: (app.image as Image)?.url,
    favicon: (app.favicon as Image)?.url,
    authorName: app.authorName || undefined,
    authorUrl: app.authorUrl || undefined,
    privacyPolicyUrl: app.privacyPolicyUrl || undefined,
    termsOfServiceUrl: app.termsOfServiceUrl || undefined,
  },
  configs: {
    webhookUrl: app.webhookUrl || undefined,
    interactionUrl: app.interactionUrl || undefined,
    federatedSearchUrl: app.federatedSearchUrl || undefined,
    redirectUris: app.redirectUris || undefined,
    federatedSearchEnabled: app.federatedSearchEnabled,
    webhookSubscriptions: app.webhookSubscriptions || undefined,
  },
  collaborators: collaborators.map(collaborator => collaborator.email),
  customCodes: app.customCodes
    ? {
        head: app.customCodes?.head || undefined,
        body: app.customCodes?.body || undefined,
      }
    : { head: undefined, body: undefined },
})

export const getShortcutConfigs = (shortcut: Shortcut): ShortcutConfigs => ({
  context: shortcut.context,
  entityType: shortcut.entityType || undefined,
  name: shortcut.name,
  description: shortcut.description || undefined,
  favicon: (shortcut.favicon as Image)?.url,
  key: shortcut.key,
  interactionUrl: shortcut.interactionUrl || undefined,
  states: shortcut.states?.map(shortcutState => ({
    state: shortcutState.state,
    condition: shortcutState.condition,
    name: shortcutState.name || undefined,
    description: shortcutState.description || undefined,
    favicon: (shortcutState.favicon as Image)?.url,
  })),
})

export const shortcutsConfigsConverter = (shortcuts: Shortcut[]): LocalConfigs => ({
  shortcuts: shortcuts.map(s => getShortcutConfigs(s)),
})

export const defaultDynamicBlockConfigsConverter = (
  block: DynamicBlock,
): DefaultDynamicBlockConfigs => ({
  key: block.key,
  interactionUrl: block.interactionUrl || undefined,
  contexts: block.contexts || undefined,
})

export const dynamicBlockConfigsConverter = (
  block: DynamicBlock,
): DynamicBlockConfigs => ({
  name: block.name,
  key: block.key,
  interactionUrl: block.interactionUrl || undefined,
  contexts: block.contexts || undefined,
  description: block.description || undefined,
  favicon: (block.favicon as Image)?.url,
  image: (block.image as Image)?.url,
})

export const blocksConfigsConverter = (blocks: DynamicBlock[]): LocalConfigs => ({
  blocks: {
    defaults: blocks
      .filter(b =>
        Object.values(DefaultDynamicBlockKeys).includes(b.key as DefaultDynamicBlockKeys),
      )
      .map(block => defaultDynamicBlockConfigsConverter(block)),
    customs: blocks
      .filter(
        b =>
          !Object.values(DefaultDynamicBlockKeys).includes(
            b.key as DefaultDynamicBlockKeys,
          ),
      )
      .map(block => dynamicBlockConfigsConverter(block)),
  },
})
