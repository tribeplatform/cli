import { EventVerb, PinnedInto, SessionClient, SpaceType } from '@enums'

export interface SessionInfo {
  ip: string
  country?: string
  locale: string
  client: SessionClient
  clientVersion: string
  os: string
  osVersion: string
  deviceBrand?: string
  deviceLocale?: string
  hubspotutk?: string
  trackerSessionId?: string
  trackerGlobalSessionId?: string
}

export interface Actor {
  id: string
  sessionInfo: SessionInfo
  roleId?: string
  roleType?: string
  spaceRoleId?: string
  spaceRoleType?: string
}

export class ExternalActor {
  id: string
  type: string
}

export interface EventWith {
  hasInvitation?: boolean
  invitationToken?: string
  hasRequestToJoin?: boolean
  reactionString?: string
  privateSpace?: boolean
  pinnedInto?: PinnedInto
}

export interface EventTarget {
  organizationId?: string
  networkId?: string
  invitationLinkId?: string
  invitationId?: string
  requestToJoinId?: string
  groupId?: string
  collectionId?: string
  spaceId?: string
  spaceType?: SpaceType
  postTypeId?: string
  postId?: string
  tagId?: string
  reactionId?: string
  memberId?: string
  memberRoleId?: string
  appId?: string
  replyId?: string
  badgeId?: string
  mediaId?: string
  memberBadgeId?: string
  templateId?: string
}

export interface BaseEventObject {
  id: string
}

export interface Event<T extends BaseEventObject = BaseEventObject> {
  _timeSensitive?: boolean
  id: string
  time: Date
  duration?: string
  name: string
  noun: string
  verb: EventVerb
  shortDescription: string
  actor?: Actor
  externalActor?: ExternalActor
  object: T
  oldObject?: T
  with?: EventWith
  target?: EventTarget
}
