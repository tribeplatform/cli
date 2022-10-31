import { CliUx, Flags } from '@oclif/core'
import { SfCommand } from '@salesforce/sf-plugins-core'
import { ActionStatus } from '@tribeplatform/gql-client/global-types'
import { CliClient, ServerError, setConfigs, validateEmail } from '../utils'

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
    'api-token': Flags.string({
      char: 't',
      summary: 'your API token',
      description: 'the API token that you want to use to login in the portal',
      env: 'BETTERMODE_API_TOKEN',
      required: false,
    }),
  }

  getEmail = async (email = ''): Promise<string> => {
    if (!email) {
      email = await CliUx.ux.prompt('- Please enter your email address', {
        required: true,
      })
    }

    validateEmail(email)

    return email
  }

  getVerificationCode = async (): Promise<string> => {
    return CliUx.ux.prompt('- Please enter the verification code that you received', {
      required: true,
      type: 'mask',
      timeout: 60,
    })
  }

  sendVerificationCode = async (email: string): Promise<void> => {
    const client = new CliClient({})
    const result = await client.mutation({
      name: 'requestGlobalTokenCode',
      args: { variables: { input: { email } }, fields: 'basic' },
    })
    if (result?.status !== ActionStatus.succeeded) {
      throw new ServerError()
    }
  }

  login = async (options: {
    email: string
    verificationCode: string
  }): Promise<LoginResponse> => {
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

    let result: LoginResponse
    if (apiToken) {
      result = { email: givenEmail || 'unknown-email', token: apiToken }
    } else {
      const email = await this.getEmail(givenEmail)
      await this.sendVerificationCode(email)
      const verificationCode = await this.getVerificationCode()
      result = await this.login({ email, verificationCode })
    }

    this.logSuccess('You have successfully logged in!')
    return result
  }
}
