export interface Interaction<P = Record<string, unknown>> {
  actorId: string
  appId: string
  interactionId: string
  dynamicBlockId?: string
  callbackId?: string
  shortcutState?: string
  inputs?: P
}
