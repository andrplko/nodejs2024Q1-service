# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install](https://docs.docker.com/engine/install/)

## Downloading

```
git clone https://github.com/andrplko/nodejs2024Q1-service.git
```

## Switch branch

```
git checkout development/part2
```

## Installing NPM modules

```
npm install
```

## Create environment file

```
rename .env.example to .env
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/api/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Docker

Manage all processes in Docker Desktop.

Docker Hub contains many pre-built images that you can pull and try without needing to define and configure your own. To download a particular image, or set of images (i.e., a repository), use `docker pull`.

- [Application](https://hub.docker.com/r/andrplko/nodejs2024q1-service-app)
- [Database](https://hub.docker.com/r/andrplko/nodejs2024q1-service-db)

Running `docker compose up --detach` starts the containers in the background and leaves them running.

```
npm run docker:up
```

Stops containers and removes containers created by up.

```
npm run docker:down
```

The `docker scout cves` command analyzes a software artifact for vulnerabilities.

```
npm run docker:scout
```

You can also use the `docker scan` command if you have MacOS Catalina 10.15 and Docker Desktop like my version 4.15. As this version doesn't support Docker Scout, you need to install Snyk CLI.

```
npm install snyk -g
Go to your Snyk account, Account Settings > API Token section.
snyk auth [<API_TOKEN>]
npm run docker:scan
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
