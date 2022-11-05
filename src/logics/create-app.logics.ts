import { Prompter } from '@salesforce/sf-plugins-core'
import {
  App,
  CreateAppInput,
  Network,
  StoreItemStanding,
} from '@tribeplatform/gql-client/global-types'
import * as Listr from 'listr'
import { join } from 'path'
import { APP_TEMPLATE_CHOICES, REPO_URL } from '../constants'
import { AppTemplate } from '../types'
import { CliClient, CliError, Shell } from '../utils'
import { getInitAppTasks } from './init-app.logics'

export type CreateAppCLIInputs = {
  networkId: string
  name: string
  slug?: string
  standing?: StoreItemStanding
  description: string
  repoOwner: string
  repoName: string
  authorName: string
  authorUrl: string
  template: AppTemplate
}

export const getCreateAppInputs = (options: {
  networks: Network[]
  officialPartner?: boolean
}): Prompter.Questions<CreateAppCLIInputs> => {
  const { networks, officialPartner = false } = options
  const result: Prompter.Questions<CreateAppCLIInputs> = [
    {
      name: 'networkId',
      type: 'list',
      default: networks[0].id,
      message: `App's network`,
      choices: networks.map(network => ({
        name: network.domain,
        value: network.id,
      })),
    },
    {
      name: 'name',
      type: 'input',
      message: `App's name`,
      default: 'My new app',
    },
    {
      name: 'description',
      type: 'input',
      message: `App's description`,
      default: 'This is my new app',
    },
    officialPartner
      ? {
          name: 'slug',
          type: 'input',
          message: `App's slug`,
          default: ({ name }: { name: string }) =>
            `${name.toLowerCase().replace(/[^\dA-Za-z]/g, '-')}`,
          validate: (slug: string) => /^[\dA-Za-z]+(?:-[\dA-Za-z]+)*$/.test(slug),
        }
      : null,
    officialPartner
      ? {
          name: 'standing',
          type: 'list',
          message: `App's standing`,
          default: StoreItemStanding.OFFICIAL,
          choices: Object.values(StoreItemStanding.OFFICIAL).map(standing => ({
            name: standing,
            value: standing,
          })),
        }
      : null,
    {
      name: 'template',
      type: 'list',
      default: APP_TEMPLATE_CHOICES.typescript,
      message: `App's template`,
      choices: Object.keys(APP_TEMPLATE_CHOICES).map(template => ({
        name: APP_TEMPLATE_CHOICES[template as AppTemplate],
        value: template,
      })),
    },
    {
      name: 'repoOwner',
      type: 'input',
      message: `Who is the GitHub owner of repository (https://github.com/OWNER/repo)`,
      default: () => `something!!!!!`,
      validate: (repoOwner: string) => /^[\dA-Za-z]+(?:-[\dA-Za-z]+)*$/.test(repoOwner),
    },
    {
      name: 'repoName',
      type: 'input',
      default: ({ name, slug }: { name: string; slug?: string }) =>
        `${(slug || name).toLowerCase().replace(/[^\dA-Za-z]/g, '-')}`,
      validate: (repoName: string) => /^[\dA-Za-z]+(?:-[\dA-Za-z]+)*$/.test(repoName),
      message: `What is the GitHub name of repository (https://github.com/owner/REPO)`,
    },
    {
      name: 'authorName',
      type: 'input',
      default: ({ repoOwner }: { repoOwner: string }) => {
        if (officialPartner) {
          return `Bettermode Engineering @bettermode`
        }

        return repoOwner
      },
      message: `Author's name`,
    },
    {
      name: 'authorUrl',
      type: 'input',
      default: () => {
        if (officialPartner) {
          return `https://bettermode.com`
        }

        return null
      },
      message: `Author's URL (https://author-site.com)`,
    },
  ]
  return result
}

export const getCreateAppTargetDirs = (
  repoName: string,
): { targetDir: string; tmpDir: string } => ({
  targetDir: repoName,
  tmpDir: `${repoName}.tmp`,
})

export const removeCreateAppTargetDirs = (input: CreateAppCLIInputs) => {
  const { targetDir, tmpDir } = getCreateAppTargetDirs(input.repoName)
  Shell.rm(join(process.cwd(), tmpDir), { silent: true })
  Shell.rm(join(process.cwd(), targetDir), { silent: true })
}

export const getCreateAppTasks = (options: {
  dev: boolean
  client: CliClient
  officialPartner?: boolean
  input: CreateAppCLIInputs
}) => {
  const {
    dev,
    client,
    officialPartner = false,
    input: {
      networkId,
      name,
      slug,
      standing,
      description,
      template,
      repoOwner,
      repoName,
      authorName,
      authorUrl,
    },
  } = options

  const { targetDir, tmpDir } = getCreateAppTargetDirs(repoName)
  const cwd = join(process.cwd(), targetDir)

  const files = Shell.find([targetDir, tmpDir], { silent: true })
  if (files.length > 0) {
    throw new CliError(`The folder \`${targetDir}\` already exists.`)
  }

  return new Listr([
    {
      title: `Download \`${APP_TEMPLATE_CHOICES[template]}\` template`,
      task: async () => {
        Shell.which('git')
        Shell.which('yarn')

        await Shell.exec(`git clone ${REPO_URL} ${tmpDir}`)

        Shell.cp(`${tmpDir}/templates/${template}`, targetDir, {
          cwd: process.cwd(),
        })
        Shell.rm(tmpDir, { cwd: process.cwd() })
      },
    },
    {
      title: 'Create the app in the portal',
      task: async ctx => {
        const input: CreateAppInput = {
          name,
          networkId,
        }
        if (officialPartner) {
          input.slug = slug
        }

        ctx.app = await client.mutation({
          name: 'createApp',
          args: {
            variables: {
              input,
            },
            fields: 'basic',
          },
        })
        ctx.app = await client.mutation({
          name: 'updateApp',
          args: {
            variables: {
              id: ctx.app.id,
              input: {
                description,
                authorName,
                authorUrl,
                standing,
              },
            },
            fields: {
              customCodes: 'all',
              favicon: 'all',
              image: 'all',
            },
          },
        })
      },
    },
    {
      title: 'Setup the app',
      task: ctx =>
        new Listr(
          [
            {
              title: 'Install package dependencies',
              task: () => Shell.exec('yarn', { cwd }),
            },
            {
              title: 'Adding app secrets to env files',
              task: async () => {
                const app = ctx.app as App

                Shell.cp('.env.example', '.env.development.local', { cwd })
                Shell.cp('.env.example', '.env.production.local', { cwd })
                Shell.cp('.env.example', '.env.test.local', { cwd })
                Shell.replaceString(
                  [
                    { search: 'client-id', replacement: app?.clientId as string },
                    {
                      search: 'client-secret',
                      replacement: app?.clientSecret as string,
                    },
                    {
                      search: 'signing-secret',
                      replacement: app?.webhookSignSecret as string,
                    },
                  ],
                  ['.env.development.local', '.env.production.local'],
                  { cwd },
                )
              },
            },
            {
              title: 'Set package name',
              task: async () => {
                Shell.replaceString(
                  { search: 'app-template', replacement: repoName },
                  [
                    'Makefile',
                    'package.json',
                    '.circleci/config.yml',
                    '.vscode/launch.json',
                  ],
                  { cwd },
                )

                Shell.rm('.git', { cwd })
                if (!officialPartner) {
                  Shell.rm('.circleci', { cwd })
                }
              },
            },
          ],
          { concurrent: true },
        ),
    },
    {
      title: `Initialize app's config`,
      task: ctx => getInitAppTasks({ client, app: ctx.app as App, dev }),
    },
    {
      title: 'Setup git repository',
      task: async () => {
        await Shell.exec('git init', { cwd })
        await Shell.exec(
          `git remote add origin git@github.com:${repoOwner}/${repoName}.git`,
          { cwd },
        )
        await Shell.exec('git add . -a', { cwd })
        await Shell.exec('git commit -am "Initial setup"', { cwd })
        await Shell.exec('git push -u origin main', { cwd, silent: true })
      },
    },
  ])
}
