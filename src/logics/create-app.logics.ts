import { App } from '@tribeplatform/gql-client/global-types'
import * as Listr from 'listr'
import { join } from 'path'
import { APP_TEMPLATE_CHOICES, REPO_URL } from '../constants'
import { AppTemplate } from '../types'
import { CliClient, CliError, Shell } from '../utils'
import { getInitAppTasks } from './init-app.logics'

export const getCreateAppTasks = (options: {
  dev: boolean
  client: CliClient
  template: AppTemplate
  networkId: string
  appName: string
  repoName: string
  official?: boolean
}) => {
  const {
    dev,
    client,
    template,
    networkId,
    appName,
    repoName,
    official = false,
  } = options

  const targetDir = repoName
  const tmpDir = `${targetDir}.tmp`
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
        ctx.app = await client.mutation({
          name: 'createApp',
          args: {
            variables: {
              input: {
                name: appName,
                slug: repoName,
                networkId,
              },
            },
            fields: 'basic',
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
                if (!official) {
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
