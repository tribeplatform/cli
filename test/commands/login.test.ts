import { expect, test } from '@oclif/test'

describe('login', () => {
  test
    .stdout()
    .command(['login', '--api-token=something'])
    .it('runs with custom api token', ctx => {
      expect(ctx.stdout).to.contain('You have successfully logged in!')
    })
})
