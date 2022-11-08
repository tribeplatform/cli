import { Flags } from '@oclif/core'
import { ActionStatus } from '@tribeplatform/gql-client/global-types'
import { BetterCommand } from '../better-command'
import { OFFICIAL_PARTNER_EMAILS } from '../constants'
import { LoginError, ServerError } from '../utils'

type LoginResponse = { email: string; accessToken: string }

export default class Login extends BetterCommand<LoginResponse> {
  static description = 'login to Bettermode portal'

  static examples = [`$ bettermode login`]

  static flags = {
    email: Flags.string({
      char: 'e',
      summary: 'your email address',
      description: 'the email address that you want to use to login in the portal',
      env: 'BETTERMODE_EMAIL',
      required: false,
    }),
  }

  async sendVerificationCode(email: string): Promise<void> {
    const client = await this.getUnAuthenticatedClient()
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

    const client = await this.getUnAuthenticatedClient()
    const { accessToken } = await client.query({
      name: 'globalToken',
      args: { variables: { input: { email, verificationCode } }, fields: 'basic' },
    })

    await this.setGlobalConfigs({ accessToken, email })

    return { email, accessToken }
  }

  async run(): Promise<LoginResponse> {
    const {
      flags: { email: givenEmail },
    } = await this.parse(Login)
    const { dev, accessToken } = await this.getGlobalFlags()

    let result: LoginResponse | null = null

    if (accessToken) {
      result = { email: givenEmail || 'unknown-email', accessToken }
    } else {
      await this.prompt<{
        email: string
        verificationCode: string
      }>([
        {
          name: 'email',
          type: 'input',
          default: givenEmail,
          message: 'Your email address',
          validate: (email: string) => {
            if (
              dev &&
              OFFICIAL_PARTNER_EMAILS.every(
                officialEmail => !email.endsWith(officialEmail),
              )
            ) {
              return 'Please use an official partner email address'
            }

            if (!email || !/^[\w+.-]+@[\dA-Za-z-]+\.[\d.A-Za-z-]+$/.test(email)) {
              return 'Please use a valid email address'
            }

            return true
          },
        },
        {
          name: 'verificationCode',
          type: 'input',
          message: 'The verification code that you received in your inbox',
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
