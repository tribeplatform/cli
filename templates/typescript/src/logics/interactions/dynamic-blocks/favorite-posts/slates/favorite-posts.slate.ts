import { RawSlateDto } from '@tribeplatform/slate-kit/dtos'

const postFieldsConfig = [
  {
    id: 'postInfoBar',
    enabled: true,
    settings: { showBackToSpaceButton: false },
    isStatic: true,
  },
  {
    id: 'galleryPostTitle',
    enabled: true,
    settings: { fullWidth: true, titleSize: 'md' },
    isStatic: true,
  },
  {
    id: 'galleryBanner',
    enabled: true,
    settings: {
      bannerStyle: 'banner',
      bannerSource: 'post',
      aspectRatio: 'aspect-video',
    },
    isStatic: true,
  },
  {
    id: 'listAvatar',
    enabled: true,
    settings: { avatarSize: 'lg', bannerSource: 'member' },
    isStatic: true,
  },
  {
    id: 'listPostSummary',
    enabled: true,
    fields: [
      {
        id: 'listPostTitle',
        enabled: true,
        settings: { titleSize: 'md' },
        isStatic: true,
      },
      { id: 'listPostContent', enabled: true, settings: {}, isStatic: true },
      { id: 'listTags', enabled: true, settings: {}, isStatic: true },
    ],
    settings: { stretchX: true },
    isStatic: true,
  },
  {
    id: 'galleryPostContent',
    enabled: true,
    settings: { fullWidth: true },
    isStatic: true,
  },
  {
    id: 'cardPostInfoBar',
    enabled: true,
    settings: {
      showReactionCount: true,
      showReplyCount: true,
      showFollowCount: true,
      fullWidth: true,
    },
    isStatic: true,
  },
]

export const FAVORITE_POSTS_SLATE = (options: {
  postIds: string[]
  take: number
  showMore: boolean
}): RawSlateDto => ({
  rootBlock: 'root',
  blocks: [
    {
      id: 'root',
      name: 'Container',
      props: { spacing: 'sm' },
      children: ['header', ...options.postIds, options.showMore && 'show-more'].filter(
        child => Boolean(child),
      ),
    },
    {
      id: 'header',
      name: 'Text',
      props: {
        value: 'Marked posts',
        size: 'lg',
      },
    },
    ...options.postIds.map(postId => ({
      id: postId,
      name: 'SinglePost',
      props: {
        postId,
        fields: postFieldsConfig,
      },
    })),
    {
      id: 'show-more',
      name: 'Button',
      props: {
        callbackId: `show-more-${options.take}`,
        variant: 'outline',
        fullWidth: true,
      },
      children: ['show-more-text'],
    },
    {
      id: 'show-more-text',
      name: 'Text',
      props: {
        value: 'Show more',
      },
    },
  ],
})
