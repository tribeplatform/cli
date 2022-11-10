# app-name

app-description
Powered by [Bettermode CLI](https://github.com/tribeplatform/cli)

- [Installation](#installation)
- [Running](#running)

# Installation

It is recommended to use [nvm](https://github.com/nvm-sh/nvm) to install the correct version of node.

```bash
nvm use
```

After that, install the dependencies:

```bash
yarn install
yarn db:generate
```

# Running

## Without Docker

```bash
yarn dev
```

## With Docker

```bash
yarn docker:up
```

to see the logs:

```bash
yarn docker:logs [server|proxy|mongo]
```

to stop the containers:

```bash
yarn docker:down
```
