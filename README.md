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
* [`bettermode hello PERSON`](#bettermode-hello-person)
* [`bettermode hello world`](#bettermode-hello-world)
* [`bettermode help [COMMAND]`](#bettermode-help-command)
* [`bettermode plugins`](#bettermode-plugins)
* [`bettermode plugins:install PLUGIN...`](#bettermode-pluginsinstall-plugin)
* [`bettermode plugins:inspect PLUGIN...`](#bettermode-pluginsinspect-plugin)
* [`bettermode plugins:install PLUGIN...`](#bettermode-pluginsinstall-plugin-1)
* [`bettermode plugins:link PLUGIN`](#bettermode-pluginslink-plugin)
* [`bettermode plugins:uninstall PLUGIN...`](#bettermode-pluginsuninstall-plugin)
* [`bettermode plugins:uninstall PLUGIN...`](#bettermode-pluginsuninstall-plugin-1)
* [`bettermode plugins:uninstall PLUGIN...`](#bettermode-pluginsuninstall-plugin-2)
* [`bettermode plugins update`](#bettermode-plugins-update)

## `bettermode hello PERSON`

Say hello

```
USAGE
  $ bettermode hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/tribeplatform/cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `bettermode hello world`

Say hello world

```
USAGE
  $ bettermode hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ bettermode hello world
  hello world! (./src/commands/hello/world.ts)
```

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.16/src/commands/help.ts)_

## `bettermode plugins`

List installed plugins.

```
USAGE
  $ bettermode plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ bettermode plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.5/src/commands/plugins/index.ts)_

## `bettermode plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ bettermode plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ bettermode plugins add

EXAMPLES
  $ bettermode plugins:install myplugin 

  $ bettermode plugins:install https://github.com/someuser/someplugin

  $ bettermode plugins:install someuser/someplugin
```

## `bettermode plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ bettermode plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ bettermode plugins:inspect myplugin
```

## `bettermode plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ bettermode plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ bettermode plugins add

EXAMPLES
  $ bettermode plugins:install myplugin 

  $ bettermode plugins:install https://github.com/someuser/someplugin

  $ bettermode plugins:install someuser/someplugin
```

## `bettermode plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ bettermode plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ bettermode plugins:link myplugin
```

## `bettermode plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bettermode plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bettermode plugins unlink
  $ bettermode plugins remove
```

## `bettermode plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bettermode plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bettermode plugins unlink
  $ bettermode plugins remove
```

## `bettermode plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ bettermode plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bettermode plugins unlink
  $ bettermode plugins remove
```

## `bettermode plugins update`

Update installed plugins.

```
USAGE
  $ bettermode plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
