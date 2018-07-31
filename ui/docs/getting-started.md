# UI - Getting started
Get up-to-speed and set up with the project.

This project talks to a fake data service to show a single table. If you wish to develop against real data you will need to createa a backend module to talk to.
There is a [sample backend module](https://github.com/openlibraryenvironment/olf-erm) based on the grails framework to get atarted with that developemnt stack.

## Pre - reading
The UI module is designed to work within the [FOLIO](https://github.com/folio-org) UX framework [stripes](https://github.com/folio-org/stripes-core).
The module itself is written javascipt using the [ECMAScript](https://www.ecma-international.org/ecma-262/8.0/index.html) standard. Although the
majority comes from ES7 we do use some features that were released in ES8, e.g. async functions.

The project is transpiled and bundled using [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/).

## Prerequisites
- [Node.js & NPM](https://docs.npmjs.com/getting-started/installing-node) are needed to build and run the project.
- [Yarn](https://yarnpkg.com/lang/en/) is used as the dependency management.
- [Gulp](https://gulpjs.com/) is used as the task runner for our project.

## Install dependencies
Open a terminal in the `ui` sub directory of this project and issue the command:
```
yarn install
```

## Running
Open a terminal in the `ui` sub directory of this project and issue the commands:
```
yarn start
```


## Needed: How to call an olf-erm service endpoint - get, post, put and delete examples
