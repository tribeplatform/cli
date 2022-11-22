export const getImageId = (image: string | null): string | undefined => {
  if (!image) return undefined

  if (image.startsWith('http')) {
    // Already uploaded and has an ID, no need to upload again
    return undefined
  }

  if (image.startsWith('data:')) {
    // TODO: Upload image and save it
    return image
  }

  if (image.startsWith('file://')) {
    // TODO: Upload image and save it
    return image
  }

  return image
}
