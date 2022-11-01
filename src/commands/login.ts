import { Flags } from '@oclif/core'
import { ActionStatus } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../better-command'
import { CliClient, LoginError, ServerError, setConfigs } from '../utils'

type LoginResponse = { email: string; token: string }

export default class Login extends BetterCommand<LoginResponse> {
  static description = 'login to Bettermode portal'

  static examples = [`$ bettermode login`]

  static flags = {
    ...BetterCommand.flags,
    email: Flags.string({
      char: 'e',
      summary: 'your email address',
      description: 'the email address that you want to use to login in the portal',
      env: 'BETTERMODE_EMAIL',
      required: false,
    }),
    'api-token': Flags.string({
      char: 't',
      summary: 'your API token',
      description: 'the API token that you want to use to login in the portal',
      env: 'BETTERMODE_API_TOKEN',
      required: false,
    }),
  }

  async sendVerificationCode(email: string): Promise<void> {
    const client = new CliClient({})
    const result = await client.mutation({
      name: 'requestGlobalTokenCode',
      args: { variables: { input: { email } }, fields: 'basic' },
    })
    if (result?.status !== ActionStatus.succeeded) {
      throw new ServerError()
    }
  }

  async login(options: {
    email: string
    verificationCode: string
  }): Promise<LoginResponse> {
    const { email, verificationCode } = options

    const client = new CliClient({})
    const result = await client.query({
      name: 'globalToken',
      args: { variables: { input: { email, verificationCode } }, fields: 'basic' },
    })

    await setConfigs({ API_TOKEN: result.accessToken, EMAIL: email })

    return { email, token: result.accessToken }
  }

  async run(): Promise<LoginResponse> {
    const {
      flags: { email: givenEmail, 'api-token': apiToken },
    } = await this.parse(Login)

    let result: LoginResponse | null = null

    if (apiToken) {
      result = { email: givenEmail || 'unknown-email', token: apiToken }
    } else {
      await this.prompt<{
        email: string
        verificationCode: string
      }>([
        {
          name: 'email',
          type: 'input',
          default: givenEmail,
          message: 'Please enter your email address',
        },
        {
          name: 'verificationCode',
          type: 'input',
          message: 'Please enter the verification code that you received',
          when: async ({ email }) => {
            if (email) {
              await this.sendVerificationCode(email)
              return true
            }

            return false
          },
          validate: async (code, answers) => {
            if (code && answers) {
              result = await this.login({ email: answers.email, verificationCode: code })
              return Boolean(result)
            }

            return false
          },
        },
      ])
    }

    if (!result) {
      throw new LoginError()
    }

    this.logSuccess('You have successfully logged in!')
    return result
  }
}
