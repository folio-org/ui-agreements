# UI - Getting started #
Get up-to-speed and set up with the projec.

## Pre - reading ##
The UI module is designed to work within the [FOLIO](https://github.com/folio-org) UX framework [stripes](https://github.com/folio-org/stripes-core).
The module itself is written javascipt using the [ECMAScript](https://www.ecma-international.org/ecma-262/8.0/index.html) standard. Although the
majority comes from ES7 we do use some features that were released in ES8, e.g. async functions.

The project is transpiled and bundled using [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/).

## Prerequisites ##
- [Node.js & NPM](https://docs.npmjs.com/getting-started/installing-node) are needed to build and run the project.
- [Yarn](https://yarnpkg.com/lang/en/) is used as the dependency management. 

## Building ##
Open a terminal in the `ui` sub directory of this project and issue the command:
```
yarn install
```

## Running ##
Currently there are 2 processes to get this project running in a development capacity.
_NOTE_ Hot-loading isn't working at the moment but will be fixed once I introduce Gulp as a simple task runner. 

### Start our module compilation as a plugable Stripes module.###
Open a terminal in the `ui` sub directory of this project and issue the commands:
```
yarn watch
```

## Start stripes with our module included.###
Open a second terminal in the `ui` sub directory of this project and issue the commands:
```
yarn start
```
