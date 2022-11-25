<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="app-repo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="images/dark-logo.png">
      <img src="images/light-logo.png" alt="Logo" width="80" height="80">
    </picture>
  </a>

  <h3 align="center">app-name</h3>

  <p align="center">
    app-description
    <br />
    Powered by <a href="https://github.com/tribeplatform/cli">@Bettermode/CLI</a>
    <br />
    <br />
    <a href="app-repo">View Demo</a>
    ·
    <a href="app-repo/issues">Report Bug</a>
    ·
    <a href="app-repo/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#running">Running</a></li>
      </ul>
    </li>
    <li><a href="#troubleshooting">Troubleshooting</a></li>
  </ol>
</details>

# Getting started

## Installation

It is recommended to use [nvm](https://github.com/nvm-sh/nvm) to install the correct version of node.

```bash
nvm use
```

After that, install the dependencies:

```bash
yarn install
yarn db:generate
```

## Running

### Without Docker

```bash
yarn docker:dev:up
yarn dev
```

### With Docker

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

# Troubleshooting

## Docker stopped working

If you are using Docker to run the app, you must be aware that in case of adding a new dependency or changing the DB schema (with Prisma), you must rebuild the image. You can do that by running the following command:

```bash
yarn docker:down
yarn docker:build
```
