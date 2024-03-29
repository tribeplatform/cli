import * as execa from 'execa'
import * as open from 'open'
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
  execAndBindStdout: async (command: string, options?: ShellOptions): Promise<void> => {
    const { cwd, silent = false } = options || {}
    try {
      await execa.command(command, { cwd }).stdout?.pipe(process.stdout)
    } catch (error) {
      if (!silent) throw error
    }
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
    const result = find(cwd || '.')
    if (result.code !== 0) return []
    return [...find(cwd || '.')]
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
  open: async (pathOrUrl: string, options?: ShellOptions): Promise<boolean> => {
    const { silent = false } = options || {}
    try {
      await open(pathOrUrl)
      return true
    } catch (error) {
      if (!silent) throw error
      return false
    }
  },
}
