import { join } from 'path'
import { readFile } from './file.utils'

export const getBettermodeTypeface = async (): Promise<string | undefined> => {
  // eslint-disable-next-line unicorn/prefer-module
  return readFile(join(__dirname, '..', 'ascii-arts', 'bettermode-typeface.txt'))
}
