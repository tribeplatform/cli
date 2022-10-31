import { CliUx, Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { GlobalClient } from '@tribeplatform/gql-client'
import { ActionStatus } from '@tribeplatform/gql-client/global-types'
import { INVALID_EMAIL, SERVER_ERROR } from '../errors'
import { makeClientRequest, setConfigs, validateEmail } from '../utils'

type LoginResponse = { email: string; token: string }

export default class Login extends SfCommand<LoginResponse> {
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

  getEmail = async (): Promise<string> => {
    const {
      flags: { email: givenEmail },
    } = await this.parse(Login)

    let email = givenEmail || ''
    if (!email) {
      email = await CliUx.ux.prompt('- Please enter your email address', {
        required: true,
      })
    }

    if (!validateEmail(email)) {
      this.error(INVALID_EMAIL)
    }

    return email
  }

  getVerificationCode = async (): Promise<string> => {
    return await CliUx.ux.prompt(
      '- Please enter the verification code that you received',
      {
        required: true,
        type: 'mask',
        timeout: 60,
      },
    )
  }

  sendVerificationCode = async (email: string): Promise<void> => {
    const client = new GlobalClient({})
    const result = await makeClientRequest(
      client.mutation({
        name: 'requestGlobalTokenCode',
        args: { variables: { input: { email } }, fields: 'basic' },
      }),
      this,
    )
    if (result?.status !== ActionStatus.succeeded) {
      this.error(SERVER_ERROR)
    }
  }

  login = async (options: {
    email: string
    verificationCode: string
  }): Promise<LoginResponse> => {
    const { email, verificationCode } = options

    const client = new GlobalClient({})
    const result = await makeClientRequest(
      client.query({
        name: 'globalToken',
        args: { variables: { input: { email, verificationCode } }, fields: 'basic' },
      }),
      this,
    )

    await setConfigs({ API_TOKEN: result.accessToken, EMAIL: email })

    return { email, token: result.accessToken }
  }

  async run(): Promise<LoginResponse> {
    const email = await this.getEmail()
    await this.sendVerificationCode(email)
    const verificationCode = await this.getVerificationCode()
    const result = await this.login({ email, verificationCode })
    this.logSuccess('You have successfully logged in!')
    return result
  }
}
