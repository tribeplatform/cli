export enum PrimaryScope {
  FullAccess = '*',

  /**
   * Network Scopes:
   * these scopes are on network level and won't apply on content level
   * in short, the context's contentId is null
   */

  // Can get public info of the auth member
  FindAuthMember = 'find_auth_member',
  // Can get private info of the auth member + auth member's apps + auth member's notifications + ...
  ViewAuthMember = 'view_auth_member',
  // Can update private info of the auth member + auth member's apps + auth member's notifications + ...
  UpdateAuthMember = 'update_auth_member',
  // Can delete the auth member
  DeleteAuthMember = 'delete_auth_member',

  // Can find the network and login to it (if it's possible)
  FindNetwork = 'find_network',
  // Can join the network
  JoinNetwork = 'join_network',
  // Can see the public info of network, members, badges, roles, groups, etc.
  ViewNetwork = 'view_network',
  // Can update network settings
  UpdateNetwork = 'update_network',
  // Can update network's billing info
  UpdateBilling = 'update_billing',
  // Can delete the network
  DeleteNetwork = 'delete_network',

  // Can invite new members
  InviteMember = 'invite_member',
  // Can see the private info of any member
  ViewMember = 'view_member',
  // Can update the private info of any member
  UpdateMember = 'update_member',
  // Can delete any member
  DeleteMember = 'delete_member',

  /**
   * Content Scopes:
   * these scopes are on content level and can also be used on network level
   * in short, the context's contentId can be null or not null
   */

  // Can moderate the content, including approving/rejecting it, changing the status, etc.
  UpdateModeration = 'update_moderation',

  // Can see the report of the content
  ViewReport = 'view_report',
  // Can update the report of the content (add more reports)
  UpdateReport = 'update_report',

  // Can find the content and see public info of it
  FindContent = 'find_content',
  // Can see the content including settings, content types, slate, etc.
  ViewContent = 'view_content',
  // Can update the content's settings, slate, available content types, etc.
  UpdateContent = 'update_content',
  // Can delete the content
  DeleteContent = 'delete_content',
  // Can create new contents
  CreateContent = 'create_content',
}
