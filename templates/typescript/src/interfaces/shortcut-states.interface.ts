import {
  Member,
  Network,
  PermissionContext,
  Post,
  Role,
  Space,
} from '@tribeplatform/gql-client/types'

import { CustomSettings } from './settings.interface'

export interface NetworkShortcutStatesInput {
  context: PermissionContext.NETWORK
  entity: Network
  shortcuts: string[]
}

export interface MemberShortcutStatesInput {
  context: PermissionContext.MEMBER
  entity: Member
  shortcuts: string[]
}

export interface SpaceShortcutStatesInput {
  context: PermissionContext.SPACE
  entity: Space
  shortcuts: string[]
}

export interface PostShortcutStatesInput {
  context: PermissionContext.POST
  entity: Post
  shortcuts: string[]
}

export interface ShortcutStatesInput {
  member: Member
  role: Role
  entities: (
    | NetworkShortcutStatesInput
    | MemberShortcutStatesInput
    | SpaceShortcutStatesInput
    | PostShortcutStatesInput
  )[]
}

export interface EntityWithSettings<T> {
  entity: T
  settings?: CustomSettings
}

export interface EntitiesByContext {
  [PermissionContext.NETWORK]?: EntityWithSettings<Network>[]
  [PermissionContext.MEMBER]?: EntityWithSettings<Member>[]
  [PermissionContext.SPACE]?: EntityWithSettings<Space>[]
  [PermissionContext.POST]?: EntityWithSettings<Post>[]
}

export interface ShortcutState {
  shortcut: string
  state: string
}

export interface ShortcutStateItemResult {
  context: PermissionContext
  entityId: string
  shortcutState: ShortcutState
}

export type ShortcutStatesResult = ShortcutStateItemResult[]

export interface ShortcutsStatesItemResult {
  context: PermissionContext
  entityId: string
  shortcutStates: ShortcutState[]
}

export type ShortcutsStatesResult = ShortcutsStatesItemResult[]
