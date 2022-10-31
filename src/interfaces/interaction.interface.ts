import { InteractionType } from '@enums'
import { SlateDto } from '@tribeplatform/slate-kit/dtos'

export interface InteractionInput<P = Record<string, unknown>> {
  actorId: string
  appId: string
  interactionId: string
  dynamicBlockId?: string
  callbackId?: string
  shortcutState?: string
  inputs?: P
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
  props: Record<string, unknown>
  slate: SlateDto
}

export interface OpenToastInteraction extends BaseInteraction {
  type: InteractionType.OpenToast
  props: Record<string, unknown>
}

export interface RedirectInteraction extends BaseInteraction {
  type: InteractionType.Redirect
  props: Record<string, unknown>
}

export interface ReloadInteraction extends BaseInteraction {
  type: InteractionType.Reload
}

export interface ShowInteraction extends BaseInteraction {
  type: InteractionType.Show
  slate: SlateDto
}

export type Interaction =
  | CloseInteraction
  | OpenModalInteraction
  | OpenToastInteraction
  | RedirectInteraction
  | ReloadInteraction
  | ShowInteraction

export interface InteractionData {
  interactions: Interaction[]
}
