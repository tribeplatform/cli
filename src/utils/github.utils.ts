import { Octokit } from '@octokit/rest'

async function searchCommits(
  octokit: Octokit,
  email: string,
): Promise<string | undefined> {
  const { data } = await octokit.search.commits({
    q: `author-email:${email}`,
    sort: 'author-date',
    // eslint-disable-next-line camelcase
    per_page: 1,
  })

  return data?.items?.[0]?.author?.login
}

export const getGithubUsername = async (
  email: string,
  options?: { token: string },
): Promise<string | undefined> => {
  if (!(typeof email === 'string' && email.includes('@'))) {
    return
  }

  const { token } = options || {}
  const octokit = new Octokit({
    auth: token,
    userAgent: 'https://github.com/tribeplatform/cli',
  })

  const { data } = await octokit.search.users({
    q: `${email} in:email`,
  })

  if (data.total_count === 0) {
    return searchCommits(octokit, email)
  }

  return data.items[0].login
}
