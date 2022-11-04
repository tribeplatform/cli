import { join } from 'path'
import { cp, exec, find, mkdir, rm, sed, which } from 'shelljs'
import { CliError } from './error.utils'

type ShellOptions = { silent?: boolean; cwd?: string }
type ReplaceStringOptions = { search: string | RegExp; replacement: string }

export const Shell = {
  exec: async (command: string, options?: ShellOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
      const { cwd, silent = false } = options || {}
      exec(command, { cwd, silent: true }, (code, stdout, stderr) => {
        if (code !== 0 && !silent) {
          reject(new CliError(stderr))
        } else if (code !== 0) {
          resolve(stderr)
        }

        resolve(stdout)
      })
    })
  },
  which: (command: string, options?: ShellOptions): boolean => {
    const { silent = false } = options || {}
    const commandExists = which(command)
    if (!commandExists && !silent) {
      throw new CliError(`Command not found: ${command}`)
    } else if (!commandExists) {
      return false
    }

    return true
  },
  find: (file: string | string[], options?: ShellOptions): string[] => {
    const { silent = false, cwd } = options || {}
    const files = Array.isArray(file) ? file : [file]

    const foundedFiles = find(cwd || '.')?.filter(file => files.includes(file))
    const notFoundedFiles = files.filter(file => !foundedFiles.includes(file))

    if (notFoundedFiles.length > 0 && !silent) {
      throw new CliError(`Files does not exist: ${notFoundedFiles.join(', ')}`)
    }

    return foundedFiles
  },
  findAll: (options?: ShellOptions): string[] => {
    const { cwd } = options || {}
    return find(cwd || '.')
  },
  mkdir: (dir: string | string[], options?: ShellOptions): boolean => {
    const { silent = false, cwd } = options || {}
    const dirs = Array.isArray(dir) ? dir : [dir]
    const { code, stderr } = mkdir(
      '-p',
      ...dirs.map(path => (cwd ? join(cwd, path) : path)),
    )

    if (code !== 0 && !silent) {
      throw new CliError(stderr)
    } else if (code !== 0) {
      return false
    }

    return true
  },
  cp: (from: string | string[], to: string, options?: ShellOptions): boolean => {
    const { silent = false, cwd } = options || {}
    const froms = Array.isArray(from) ? from : [from]
    const { code, stderr } = cp(
      '-Rf',
      froms.map(from => (cwd ? join(cwd, from) : from)),
      cwd ? join(cwd, to) : to,
    )

    if (code !== 0 && !silent) {
      throw new CliError(stderr)
    } else if (code !== 0) {
      return false
    }

    return true
  },
  rm: (path: string, options?: ShellOptions): boolean => {
    const { silent = false, cwd } = options || {}
    const { code, stderr } = rm('-rf', cwd ? join(cwd, path) : path)

    if (code !== 0 && !silent) {
      throw new CliError(stderr)
    } else if (code !== 0) {
      return false
    }

    return true
  },
  replaceString: (
    input: ReplaceStringOptions | ReplaceStringOptions[],
    files: string[],
    options?: ShellOptions,
  ): boolean => {
    const { silent = false, cwd } = options || {}
    const inputs = Array.isArray(input) ? input : [input]
    const paths = files.map(file => (cwd ? join(cwd, file) : file))

    for (const { search, replacement } of inputs) {
      const { code, stderr } = sed('-i', search, replacement, paths)

      if (code !== 0 && !silent) {
        throw new CliError(stderr)
      } else if (code !== 0) {
        return false
      }
    }

    return true
  },
}
