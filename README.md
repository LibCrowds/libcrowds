# libcrowds-frontend

[![Build Status](https://travis-ci.org/LibCrowds/libcrowds-frontend.svg?branch=master)](https://travis-ci.org/LibCrowds/libcrowds-frontend)
[![dependencies Status](https://david-dm.org/LibCrowds/libcrowds-frontend/status.svg)](https://david-dm.org/LibCrowds/libcrowds-frontend)
[![devDependencies Status](https://david-dm.org/LibCrowds/libcrowds-frontend/dev-status.svg)](https://david-dm.org/LibCrowds/libcrowds-frontend?type=dev)

> The LibCrowds front-end

## Building

``` bash
# install dependencies
npm install

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Testing

``` bash
# run unit tests
npm unit

# run e2e tests
export BROWSERSTACK_USERNAME=<browserstack-username>
export BROWSERSTACK_ACCESS_KEY=<browserstack-access-key>
npm run e2e
```

End-to-end tests are run using BrowserStack, a cross browser and real device web-based testing platform.

[![BrowserStack Logo](browserstack-logo.png)](https://www.browserstack.com)

## Developing

Start up a local PyBossa instance using the default settings, then:

``` bash
# serve with hot reload at localhost:8080
npm run dev
```

## Deploying

The LibCrowds front-end runs from GitHub pages, so to deploy you can just do this:

``` bash
# deploy to gh-pages
npm run gh-pages
```

## Configuring

Configuration settings can be found in [config.js](src/config.js).
