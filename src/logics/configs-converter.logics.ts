import {
  App,
  AppCollaborator,
  CreateDynamicBlockInput,
  CreateShortcutInput,
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
import { getImageId } from './image.logics'

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
    description: app.description || null,
    image: (app.image as Image)?.url || app.imageId || null,
    favicon: (app.favicon as Image)?.url || app.faviconId || null,
    authorName: app.authorName || null,
    authorUrl: app.authorUrl || null,
    privacyPolicyUrl: app.privacyPolicyUrl || null,
    termsOfServiceUrl: app.termsOfServiceUrl || null,
  },
  configs: {
    webhookUrl: app.webhookUrl || null,
    interactionUrl: app.interactionUrl || null,
    federatedSearchUrl: app.federatedSearchUrl || null,
    redirectUris: app.redirectUris || null,
    federatedSearchEnabled: app.federatedSearchEnabled,
    webhookSubscriptions: app.webhookSubscriptions || null,
  },
  collaborators: collaborators.map(collaborator => collaborator.email),
  customCodes: {
    head: app.customCodes?.head || null,
    body: app.customCodes?.body || null,
  },
})

export const getShortcutConfigs = (shortcut: Shortcut): ShortcutConfigs => ({
  context: shortcut.context,
  entityType: shortcut.entityType || null,
  name: shortcut.name,
  description: shortcut.description || null,
  favicon: (shortcut.favicon as Image)?.url || shortcut.faviconId || null,
  key: shortcut.key,
  interactionUrl: shortcut.interactionUrl || null,
  states:
    shortcut.states?.map(shortcutState => ({
      state: shortcutState.state,
      name: shortcutState.name || null,
      description: shortcutState.description || null,
      favicon: shortcutState.faviconId || null,
    })) || null,
})

export const shortcutsConfigsConverter = (shortcuts: Shortcut[]): LocalConfigs => ({
  shortcuts: shortcuts.map(s => getShortcutConfigs(s)),
})

export const defaultDynamicBlockConfigsConverter = (
  block: DynamicBlock,
): DefaultDynamicBlockConfigs => ({
  key: block.key,
  interactionUrl: block.interactionUrl || null,
  contexts: block.contexts || null,
})

export const dynamicBlockConfigsConverter = (
  block: DynamicBlock,
): DynamicBlockConfigs => ({
  name: block.name,
  key: block.key,
  interactionUrl: block.interactionUrl || null,
  contexts: block.contexts || null,
  description: block.description || null,
  favicon: (block.favicon as Image)?.url || block.faviconId || null,
  image: (block.image as Image)?.url || block.imageId || null,
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

export const convertShortcutImages = (shortcut: ShortcutConfigs): CreateShortcutInput => {
  const { favicon, states, ...rest } = shortcut
  return {
    ...rest,
    faviconId: getImageId(favicon),
    states: states?.map(state => {
      const { favicon, ...rest } = state
      return {
        ...rest,
        faviconId: getImageId(favicon),
      }
    }),
  }
}

export const convertBlockImages = (
  block: DynamicBlockConfigs,
): CreateDynamicBlockInput => {
  const { favicon, image, ...rest } = block
  return {
    ...rest,
    faviconId: getImageId(favicon),
    imageId: getImageId(image),
  }
}

export const convertBlocksToCreateInput = (
  blocks: DynamicBlock[],
): CreateDynamicBlockInput[] => {
  return blocks.map(block => convertBlockImages(dynamicBlockConfigsConverter(block)))
}

export const convertShortcutsToCreateInput = (
  shortcuts: Shortcut[],
): CreateShortcutInput[] => {
  return shortcuts.map(shortcut => convertShortcutImages(getShortcutConfigs(shortcut)))
}
