oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
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
@tribeplatform/cli/0.0.0 darwin-arm64 node-v16.13.0
$ bettermode --help [COMMAND]
USAGE
  $ bettermode COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bettermode autocomplete [SHELL]`](#bettermode-autocomplete-shell)
* [`bettermode base`](#bettermode-base)
* [`bettermode commands`](#bettermode-commands)
* [`bettermode help [COMMAND]`](#bettermode-help-command)
* [`bettermode login`](#bettermode-login)
* [`bettermode networks`](#bettermode-networks)
* [`bettermode update [CHANNEL]`](#bettermode-update-channel)
* [`bettermode whoami`](#bettermode-whoami)

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

## `bettermode base`

```
USAGE
  $ bettermode base
```

_See code: [dist/commands/base.ts](https://github.com/tribeplatform/cli/blob/v0.0.0/dist/commands/base.ts)_

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

Login to Bettermode portal

```
USAGE
  $ bettermode login [-e <value>]

FLAGS
  -e, --email=<value>  your email address

DESCRIPTION
  Login to Bettermode portal

EXAMPLES
  $ bettermode login

FLAG DESCRIPTIONS
  -e, --email=<value>  your email address

    the email address that you want to use to login in the portal
```

_See code: [dist/commands/login.ts](https://github.com/tribeplatform/cli/blob/v0.0.0/dist/commands/login.ts)_

## `bettermode networks`

Shows your networks

```
USAGE
  $ bettermode networks [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |
    | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  Shows your networks

EXAMPLES
  $ bettermode networks
```

_See code: [dist/commands/networks.ts](https://github.com/tribeplatform/cli/blob/v0.0.0/dist/commands/networks.ts)_

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

Shows your authorized email address

```
USAGE
  $ bettermode whoami

DESCRIPTION
  Shows your authorized email address

EXAMPLES
  $ bettermode whoami
```

_See code: [dist/commands/whoami.ts](https://github.com/tribeplatform/cli/blob/v0.0.0/dist/commands/whoami.ts)_
<!-- commandsstop -->
