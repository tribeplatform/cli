import { Prompter } from '@salesforce/sf-plugins-core'
import { App, CreateAppInput, Network } from '@tribeplatform/gql-client/global-types'
import * as Listr from 'listr'
import { join } from 'path'
import { APP_TEMPLATE_CHOICES, REPO_URL } from '../constants'
import { AppTemplate } from '../types'
import { CliClient, CliError, Shell } from '../utils'
import { getInitAppTasks } from './init-app.logics'

export type CreateAppInputs = {
  networkId: string
  name: string
  slug?: string
  description: string
  repoOwner: string
  repoName: string
  template: AppTemplate
}

export const getCreateAppInputs = (options: {
  networks: Network[]
  officialPartner?: boolean
}): Prompter.Questions<CreateAppInputs> => {
  const { networks, officialPartner = false } = options
  return [
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
      name: 'template',
      type: 'list',
      default: APP_TEMPLATE_CHOICES.typescript,
      message: `Please select your preferred app template:`,
      choices: Object.keys(APP_TEMPLATE_CHOICES).map(template => ({
        name: APP_TEMPLATE_CHOICES[template as AppTemplate],
        value: template,
      })),
    },
  ].filter(item => Boolean(item))
}

export const getCreateAppTargetDirs = (
  repoName: string,
): { targetDir: string; tmpDir: string } => ({
  targetDir: repoName,
  tmpDir: `${repoName}.tmp`,
})

export const removeCreateAppTargetDirs = (input: CreateAppInputs) => {
  const { targetDir, tmpDir } = getCreateAppTargetDirs(input.repoName)
  Shell.rm(join(process.cwd(), tmpDir), { silent: true })
  Shell.rm(join(process.cwd(), targetDir), { silent: true })
}

export const getCreateAppTasks = (options: {
  dev: boolean
  client: CliClient
  officialPartner?: boolean
  input: CreateAppInputs
}) => {
  const {
    dev,
    client,
    officialPartner = false,
    input: { networkId, name, slug, description, repoName, template },
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
  ])
}
