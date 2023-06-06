import { InteractionType, ToastStatus } from '@enums'
import { PermissionContext } from '@tribeplatform/gql-client/types'
import { SlateDto } from '@tribeplatform/slate-kit/dtos'

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ToastInteractionProps {
  status: ToastStatus
  title: string
  description?: string
  link?: {
    href: string
    text: string
    enableCopy?: boolean
  }
}

export interface ModalInteractionProps {
  size: ContainerSize
  title: string
  description?: string
}

export interface ReloadInteractionProps {
  context?: PermissionContext
  entityId?: string
  dynamicBlockKeys?: string[]
}

export interface RedirectInteractionProps {
  url: string
  external?: boolean
}

export interface InteractionInput<T = { [key: string]: unknown }> {
  actorId: string
  appId: string
  interactionId: string
  preview?: boolean
  dynamicBlockKey?: string
  shortcutKey?: string
  callbackId?: string
  inputs?: T
  props?: unknown
}

export interface BaseInteraction {
  id: string
  type: InteractionType
}

export interface CloseInteraction extends BaseInteraction {
  type: InteractionType.Close
}

export interface OpenModalInteraction extends BaseInteraction {
  type: InteractionType.OpenModal
  props: ModalInteractionProps
  slate: SlateDto
}

export interface OpenToastInteraction extends BaseInteraction {
  type: InteractionType.OpenToast
  props: ToastInteractionProps
}

export interface RedirectInteraction extends BaseInteraction {
  type: InteractionType.Redirect
  props: RedirectInteractionProps
}

export interface ReloadInteraction extends BaseInteraction {
  type: InteractionType.Reload
  props: ReloadInteractionProps
}

export interface ShowInteraction extends BaseInteraction {
  type: InteractionType.Show
  slate: SlateDto
}

export interface DataInteraction<T = any> extends BaseInteraction {
  type: InteractionType.Data
  props: T
}

export type Interaction =
  | CloseInteraction
  | OpenModalInteraction
  | OpenToastInteraction
  | RedirectInteraction
  | ReloadInteraction
  | ShowInteraction
  | DataInteraction

export interface InteractionData {
  interactions: Interaction[]
}
