import { Prompter } from '@salesforce/sf-plugins-core'
import {
  App,
  AppCollaborator,
  CreateAppInput,
  DefaultDynamicBlockKeys,
  DynamicBlock,
  Network,
  PermissionContext,
  Shortcut,
  StoreItemStanding,
} from '@tribeplatform/gql-client/global-types'
import * as Listr from 'listr'
import { join } from 'path'
import { APP_TEMPLATE_CHOICES, lICENSES, REPO_URL } from '../constants'
import { AppTemplate, GithubUser } from '../types'
import { CliClient, CliError, Shell } from '../utils'
import { getSyncAppTasks } from './sync-app.logics'

export type CreateAppCLIInputs = {
  devNetworkId?: string
  networkId: string
  name: string
  slug?: string
  standing?: StoreItemStanding
  description: string
  domain: string
  devDomain?: string
  repoOwner: string
  repoName: string
  authorName: string
  authorUrl: string
  license: string
  template: AppTemplate
}

export const getCreateAppInputs = (options: {
  devNetworks: Network[]
  networks: Network[]
  githubUser: GithubUser | null
  officialPartner?: boolean
}): Prompter.Questions<CreateAppCLIInputs> => {
  const { devNetworks, networks, githubUser, officialPartner = false } = options
  return [
    {
      name: 'devNetworkId',
      type: 'list',
      default: devNetworks[0].id,
      message: `App's network in dev environment`,
      choices: devNetworks.map(network => ({
        name: network.domain,
        value: network.id,
      })),
      when: devNetworks.length > 0,
    },
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
      default: 'An awesome app that works with Bettermode platform!',
    },
    {
      name: 'slug',
      type: 'input',
      message: `App's slug`,
      default: ({ name }: { name: string }) =>
        `${name.toLowerCase().replace(/[^\dA-Za-z]/g, '-')}`,
      validate: (slug: string) => /^[\dA-Za-z]+(?:-[\dA-Za-z]+)*$/.test(slug),
      when: officialPartner,
    },
    {
      name: 'standing',
      type: 'list',
      message: `App's standing`,
      default: StoreItemStanding.OFFICIAL,
      choices: Object.values(StoreItemStanding).map(standing => ({
        name: standing,
        value: standing,
      })),
      when: officialPartner,
    },
    {
      name: 'devDomain',
      type: 'input',
      message: `App's domain in dev environment`,
      default: ({ slug }: { slug: string }) => `${slug}-dev.tribeplatform.app`,
      validate: (domain: string) =>
        /^(?:[\dA-Za-z]+(?:-[\dA-Za-z]+)*\.){2}[\dA-Za-z]+$/.test(domain),
    },
    {
      name: 'domain',
      type: 'input',
      message: `App's domain`,
      default: ({ slug }: { slug: string }) => {
        if (officialPartner) {
          return `${slug}.tribeplatform.app`
        }

        return `${slug}.tribe.localhost`
      },
      validate: (domain: string) =>
        /^(?:[\dA-Za-z]+(?:-[\dA-Za-z]+)*\.){2}[\dA-Za-z]+$/.test(domain),
    },
    {
      name: 'template',
      type: 'list',
      default: APP_TEMPLATE_CHOICES.typescript,
      message: `App's template`,
      choices: Object.keys(APP_TEMPLATE_CHOICES).map(template => ({
        name: APP_TEMPLATE_CHOICES[template as AppTemplate],
        value: template,
      })),
      when: Object.keys(APP_TEMPLATE_CHOICES).length > 1,
    },
    {
      name: 'repoOwner',
      type: 'input',
      message: `Who is the GitHub owner of repository (https://github.com/OWNER/repo)`,
      default: () => `${githubUser?.username || githubUser?.email?.split('@')?.[0]}`,
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

        return githubUser ? `${githubUser.name} @${githubUser.username}` : repoOwner
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
    {
      name: 'license',
      type: 'list',
      message: `App's license`,
      default: 'MIT',
      choices: lICENSES,
    },
  ]
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

export const createApp = async (options: {
  client: CliClient
  domain: string
  officialPartner: boolean
  input: CreateAppInput
}): Promise<App> => {
  const { client, domain, officialPartner, input } = options
  const { name, networkId, slug, description, authorName, authorUrl, standing } = input
  const app = await client.mutation({
    name: 'createApp',
    args: {
      variables: {
        input: {
          name,
          networkId,
          slug,
          description,
          authorName,
          authorUrl,
          standing,
          webhookUrl: `https://${domain}/webhook`,
          interactionUrl: `https://${domain}/webhook/interaction`,
          federatedSearchUrl: `https://${domain}/webhook/federated-search`,
          privacyPolicyUrl: officialPartner
            ? `https://bettermode.io/privacy-policy`
            : null,
          termsOfServiceUrl: officialPartner
            ? `https://bettermode.io/terms-of-service`
            : null,
          webhookSubscriptions: ['network.updated'],
          dynamicBlocks: [{ key: DefaultDynamicBlockKeys.settings }],
          shortcuts: [
            {
              key: 'mark-as-favorite',
              name: 'Mark as favorite',
              faviconId: 'bookmark',
              context: PermissionContext.POST,
              states: [
                {
                  state: 'unmarked',
                },
                {
                  state: 'marked',
                  name: 'Remove from favorites',
                  faviconId: 'solid:bookmark',
                },
              ],
            },
          ],
        },
      },
      fields: {
        customCodes: 'all',
        favicon: 'all',
        image: 'all',
      },
    },
  })
  return app
}

export const getCreateAppTasks = (options: {
  dev: boolean
  client: CliClient
  devClient: CliClient | null
  officialPartner?: boolean
  input: CreateAppCLIInputs
}): Listr<{
  app: App
  devApp?: App
  collaborators: AppCollaborator[]
  devCollaborators?: AppCollaborator[]
  shortcuts: Shortcut[]
  devShortcuts?: Shortcut[]
  blocks: DynamicBlock[]
  devBlocks?: DynamicBlock[]
}> => {
  const { dev, client, devClient, officialPartner = false, input } = options
  const {
    devNetworkId,
    description,
    devDomain,
    domain,
    name,
    template,
    repoOwner,
    repoName,
    authorName,
    license,
  } = input

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

        Shell.cp(join(tmpDir, 'templates', template), targetDir, {
          cwd: process.cwd(),
        })
        Shell.cp(join(tmpDir, 'licenses', license), join(targetDir, 'LICENSE.md'), {
          cwd: process.cwd(),
        })
        Shell.rm(tmpDir, { cwd: process.cwd() })
      },
    },
    {
      title: 'Create the app in the portal',
      enabled: () => !dev,
      task: async ctx => {
        ctx.app = await createApp({
          client,
          domain,
          officialPartner,
          input,
        })
      },
    },
    {
      title: 'Create the app in the portal',
      enabled: () => dev,
      task: () =>
        new Listr([
          {
            title: 'on production environment',
            task: async ctx => {
              ctx.app = await createApp({
                client,
                domain,
                officialPartner,
                input,
              })
            },
          },
          {
            title: 'on development environment',
            task: async ctx => {
              ctx.devApp = await createApp({
                client: devClient as CliClient,
                domain: devDomain as string,
                officialPartner,
                input: {
                  ...input,
                  networkId: devNetworkId as string,
                },
              })
            },
          },
        ]),
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
                const app = ctx.app
                const devApp = ctx.devApp

                Shell.cp('.env.example', '.env.development.local', { cwd })
                Shell.cp('.env.example', '.env.production.local', { cwd })
                Shell.cp('.env.example', '.env.test.local', { cwd })
                Shell.replaceString(
                  [
                    {
                      search: 'client-id',
                      replacement: (devApp || app)?.clientId as string,
                    },
                    {
                      search: 'client-secret',
                      replacement: (devApp || app)?.clientSecret as string,
                    },
                    {
                      search: 'signing-secret',
                      replacement: (devApp || app)?.webhookSignSecret as string,
                    },
                    { search: 'app-slug', replacement: repoName },
                  ],
                  ['.env.development.local'],
                  { cwd },
                )
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
                    { search: 'app-slug', replacement: repoName },
                    {
                      search: 'LOG_LEVEL = verbose',
                      replacement: 'LOG_LEVEL = info',
                    },
                    {
                      search: 'LOG_FORMAT = pretty',
                      replacement: 'LOG_FORMAT = json',
                    },
                    {
                      search: 'ORIGIN = *',
                      replacement: `ORIGIN = ${domain}`,
                    },
                  ],
                  ['.env.production.local'],
                  { cwd },
                )
              },
            },
            {
              title: 'Set package name',
              task: async () => {
                Shell.replaceString(
                  [
                    { search: 'app-name', replacement: name },
                    { search: 'app-template', replacement: repoName },
                    { search: 'app-description', replacement: description },
                    { search: 'app-author', replacement: authorName },
                    { search: 'app-license', replacement: license },
                    {
                      search: 'app-repo',
                      replacement: `https://github.com/${repoOwner}/${repoName}`,
                    },
                    {
                      search: 'app-year',
                      replacement: new Date().getFullYear().toString(),
                    },
                  ],
                  [
                    'Makefile',
                    'package.json',
                    'LICENSE.md',
                    'README.md',
                    join('.circleci', 'config.yml'),
                    join('.vscode', 'launch.json'),
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
      task: ctx => getSyncAppTasks({ client, app: ctx.app, dev: false, cwd }),
    },
    {
      title: `Initialize app's config for development`,
      enabled: () => dev,
      task: ctx =>
        getSyncAppTasks({
          client: devClient as CliClient,
          app: ctx.devApp as App,
          dev: true,
          cwd,
        }),
    },
    {
      title: 'Setup git repository',
      task: async (ctx, task) => {
        try {
          await Shell.exec('git init', { cwd })
          await Shell.exec(
            `git remote add origin git@github.com:${repoOwner}/${repoName}.git`,
            { cwd },
          )
          await Shell.exec('git add --all', { cwd })
          await Shell.exec('git commit -m "Initial setup"', { cwd })
          await Shell.exec('git push -u origin main', { cwd })
        } catch (error) {
          task.skip((error as Error)?.toString() || 'Failed to setup git repository')
        }
      },
    },
  ])
}
