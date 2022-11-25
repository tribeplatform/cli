import { RawSlateDto } from '@tribeplatform/slate-kit/dtos'

export const EMPTY_FAVORITE_POSTS_SLATE: RawSlateDto = {
  rootBlock: 'root',
  blocks: [
    {
      id: 'root',
      name: 'Container',
      props: { spacing: 'sm' },
      children: ['title', 'description'],
    },
    {
      id: 'title',
      name: 'Text',
      props: { value: 'Marked posts', size: 'lg' },
    },
    {
      id: 'description',
      name: 'Text',
      props: {
        value:
          'You have no marked posts yet, you can mark posts by clicking on the ... icon on the post.',
      },
    },
  ],
}
