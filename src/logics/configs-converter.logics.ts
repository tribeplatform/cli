import {
  App,
  AppCollaborator,
  DefaultDynamicBlockKeys,
  DynamicBlock,
  Image,
  Shortcut,
} from '@tribeplatform/gql-client/global-types'
import { DynamicBlockConfigs, LocalConfigs, ShortcutConfigs } from '../types'

export const appConfigsConverter = (app: App): LocalConfigs => ({
  id: app.id,
  name: app.name,
  slug: app.slug,
  status: app.status,
  standing: app.standing,

  description: app.description || undefined,
  image: (app.image as Image)?.url,
  favicon: (app.favicon as Image)?.url,

  webhookUrl: app.webhookUrl || undefined,
  federatedSearchUrl: app.federatedSearchUrl || undefined,
  interactionUrl: app.interactionUrl || undefined,
  redirectUris: app.redirectUris || undefined,

  webhookSubscriptions: app.webhookSubscriptions || undefined,
  customCodes: app.customCodes
    ? {
        head: app.customCodes?.head || undefined,
        body: app.customCodes?.body || undefined,
      }
    : undefined,
})

export const collaboratorsConfigsConverter = (
  collaborators: AppCollaborator[],
): LocalConfigs => ({
  collaborators: collaborators.map(collaborator => collaborator.email),
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
): DynamicBlockConfigs => ({
  key: block.key,
  interactionUrl: block.interactionUrl || undefined,
  contexts: block.contexts || undefined,
})

export const dynamicBlockConfigsConverter = (
  block: DynamicBlock,
): DynamicBlockConfigs => ({
  ...defaultDynamicBlockConfigsConverter(block),
  name: block.name,
  description: block.description || undefined,
  favicon: (block.favicon as Image)?.url,
  image: (block.image as Image)?.url,
})

export const blocksConfigsConverter = (blocks: DynamicBlock[]): LocalConfigs => ({
  blocks: {
    defaults: blocks
      .filter(b => Object.values(DefaultDynamicBlockKeys).includes(b.key))
      .map(block => defaultDynamicBlockConfigsConverter(block)),
    customs: blocks
      .filter(b => !Object.values(DefaultDynamicBlockKeys).includes(b.key))
      .map(block => dynamicBlockConfigsConverter(block)),
  },
})
