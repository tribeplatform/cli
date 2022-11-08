# Bettermode CLI

Bettermode CLI is a command line tool for managing your bettermode partner account. It is
written in TypeScript and uses the [Betterment API](https://partners.tribe.so/docs/guide/index).

[![bettermode](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://tribe.so)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://www.npmjs.com/package/@tribeplatform/cli)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://www.npmjs.com/package/@tribeplatform/cli)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/tribeplatform/cli/blob/main/LICENSE)

<!-- toc -->
* [Bettermode CLI](#bettermode-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @tribeplatform/cli
$ bettermode COMMAND
running command...
$ bettermode (--version)
@tribeplatform/cli/0.0.6 darwin-arm64 node-v16.13.0
$ bettermode --help [COMMAND]
USAGE
  $ bettermode COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`bettermode app create`](#bettermode-app-create)
* [`bettermode app init`](#bettermode-app-init)
* [`bettermode app list`](#bettermode-app-list)
* [`bettermode app publish`](#bettermode-app-publish)
* [`bettermode app start`](#bettermode-app-start)
* [`bettermode app sync`](#bettermode-app-sync)
* [`bettermode app unpublish`](#bettermode-app-unpublish)
* [`bettermode app update`](#bettermode-app-update)
* [`bettermode autocomplete [SHELL]`](#bettermode-autocomplete-shell)
* [`bettermode commands`](#bettermode-commands)
* [`bettermode help [COMMAND]`](#bettermode-help-command)
* [`bettermode login`](#bettermode-login)
* [`bettermode logout`](#bettermode-logout)
* [`bettermode networks`](#bettermode-networks)
* [`bettermode ngrok`](#bettermode-ngrok)
* [`bettermode update [CHANNEL]`](#bettermode-update-channel)
* [`bettermode whoami`](#bettermode-whoami)

## `bettermode app create`

create a new app

```
USAGE
  $ bettermode app create [--json] [-t <value>] [-d]

FLAGS
  -d, --dev                   development mode
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  create a new app

EXAMPLES
  $ bettermode app create

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

## `bettermode app init`

initialize an existing app into the current directory

```
USAGE
  $ bettermode app init [--json] [-t <value>] [-d] [-i <value>]

FLAGS
  -d, --dev                   development mode
  -i, --id=<value>            the app id
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  initialize an existing app into the current directory

EXAMPLES
  $ bettermode app init --id tj7oAwlJsO61

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -i, --id=<value>  the app id

    the id of the app that you want to initialize

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

## `bettermode app list`

list your apps

```
USAGE
  $ bettermode app list [--json] [-t <value>] [-d] [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -d, --dev                   development mode
  -t, --access-token=<value>  your access token
  -x, --extended              show extra columns
  --columns=<value>           only show provided columns (comma-separated)
  --csv                       output is csv format [alias: --output=csv]
  --filter=<value>            filter property by partial string matching, ex: name=foo
  --no-header                 hide table header from output
  --no-truncate               do not truncate output to fit screen
  --output=<option>           output in a more machine friendly format
                              <options: csv|json|yaml>
  --sort=<value>              property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list your apps

EXAMPLES
  $ bettermode app list

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

## `bettermode app publish`

publish app

```
USAGE
  $ bettermode app publish [--json] [-t <value>] [-d] [-p]

FLAGS
  -d, --dev                   development mode
  -p, --publicly              publish publicly
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  publish app

EXAMPLES
  $ bettermode app publish

  $ bettermode app publish --publicly

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -p, --publicly  publish publicly

    publish the app publicly for all networks

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

## `bettermode app start`

start app with ngrok

```
USAGE
  $ bettermode app start [--json] [-t <value>] [-d] [-s <value>]

FLAGS
  -d, --dev                   development mode
  -s, --sub-domain=<value>    your ngrok sub domain
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  start app with ngrok

EXAMPLES
  $ bettermode app start

  $ bettermode app start --sub-domain my-sub-domain

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -s, --sub-domain=<value>  your ngrok sub domain

    the ngrok sub domain that you want to use to start the tunnel

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

## `bettermode app sync`

sync app configs

```
USAGE
  $ bettermode app sync [--json] [-t <value>] [-d]

FLAGS
  -d, --dev                   development mode
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  sync app configs

EXAMPLES
  $ bettermode app sync

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

## `bettermode app unpublish`

unpublish app

```
USAGE
  $ bettermode app unpublish [--json] [-t <value>] [-d] [-p]

FLAGS
  -d, --dev                   development mode
  -p, --publicly              unpublish publicly
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  unpublish app

EXAMPLES
  $ bettermode app unpublish

  $ bettermode app unpublish --publicly

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -p, --publicly  unpublish publicly

    unpublish the app publicly from all networks (except the privately published ones)

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

## `bettermode app update`

update app configs

```
USAGE
  $ bettermode app update [--json] [-t <value>] [-d]

FLAGS
  -d, --dev                   development mode
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  update app configs

EXAMPLES
  $ bettermode app update

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

## `bettermode autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ bettermode autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ bettermode autocomplete

  $ bettermode autocomplete bash

  $ bettermode autocomplete zsh

  $ bettermode autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.3.5/src/commands/autocomplete/index.ts)_

## `bettermode commands`

list all the commands

```
USAGE
  $ bettermode commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)
  --tree             show tree of commands

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.2.1/src/commands/commands.ts)_

## `bettermode help [COMMAND]`

Display help for bettermode.

```
USAGE
  $ bettermode help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for bettermode.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.17/src/commands/help.ts)_

## `bettermode login`

login to Bettermode portal

```
USAGE
  $ bettermode login [--json] [-t <value>] [-d] [-e <value>]

FLAGS
  -d, --dev                   development mode
  -e, --email=<value>         your email address
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  login to Bettermode portal

EXAMPLES
  $ bettermode login

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -e, --email=<value>  your email address

    the email address that you want to use to login in the portal

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

_See code: [dist/commands/login.ts](https://github.com/tribeplatform/cli/blob/v0.0.6/dist/commands/login.ts)_

## `bettermode logout`

logout from Bettermode portal

```
USAGE
  $ bettermode logout [--json] [-t <value>] [-d]

FLAGS
  -d, --dev                   development mode
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  logout from Bettermode portal

EXAMPLES
  $ bettermode logout

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

_See code: [dist/commands/logout.ts](https://github.com/tribeplatform/cli/blob/v0.0.6/dist/commands/logout.ts)_

## `bettermode networks`

list your networks

```
USAGE
  $ bettermode networks [--json] [-t <value>] [-d] [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -d, --dev                   development mode
  -t, --access-token=<value>  your access token
  -x, --extended              show extra columns
  --columns=<value>           only show provided columns (comma-separated)
  --csv                       output is csv format [alias: --output=csv]
  --filter=<value>            filter property by partial string matching, ex: name=foo
  --no-header                 hide table header from output
  --no-truncate               do not truncate output to fit screen
  --output=<option>           output in a more machine friendly format
                              <options: csv|json|yaml>
  --sort=<value>              property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list your networks

EXAMPLES
  $ bettermode networks

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

_See code: [dist/commands/networks.ts](https://github.com/tribeplatform/cli/blob/v0.0.6/dist/commands/networks.ts)_

## `bettermode ngrok`

setup your ngrok account

```
USAGE
  $ bettermode ngrok [--json] [-t <value>] [-d] [-a <value>]

FLAGS
  -a, --auth-token=<value>    your ngrok auth token
  -d, --dev                   development mode
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  setup your ngrok account

EXAMPLES
  $ bettermode ngrok

  $ bettermode ngrok --auth-token=your-auth-token

FLAG DESCRIPTIONS
  -a, --auth-token=<value>  your ngrok auth token

    the ngrok auth token that you want to use to start the tunnel

  -d, --dev  development mode

    actions will happen in development mode

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

_See code: [dist/commands/ngrok.ts](https://github.com/tribeplatform/cli/blob/v0.0.6/dist/commands/ngrok.ts)_

## `bettermode update [CHANNEL]`

update the bettermode CLI

```
USAGE
  $ bettermode update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the bettermode CLI

EXAMPLES
  Update to the stable channel:

    $ bettermode update stable

  Update to a specific version:

    $ bettermode update --version 1.0.0

  Interactively select version:

    $ bettermode update --interactive

  See available versions:

    $ bettermode update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.0.6/src/commands/update.ts)_

## `bettermode whoami`

check your authorized email address

```
USAGE
  $ bettermode whoami [--json] [-t <value>] [-d]

FLAGS
  -d, --dev                   development mode
  -t, --access-token=<value>  your access token

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  check your authorized email address

EXAMPLES
  $ bettermode whoami

FLAG DESCRIPTIONS
  -d, --dev  development mode

    actions will happen in development mode

  -t, --access-token=<value>  your access token

    a custom access token that you want to use to login in the portal
```

_See code: [dist/commands/whoami.ts](https://github.com/tribeplatform/cli/blob/v0.0.6/dist/commands/whoami.ts)_
<!-- commandsstop -->
