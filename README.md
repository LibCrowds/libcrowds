# vue-pybossa-frontend

[![Build Status](https://travis-ci.org/LibCrowds/vue-pybossa-frontend.svg?branch=master)](https://travis-ci.org/LibCrowds/vue-pybossa-frontend)
[![dependencies Status](https://david-dm.org/LibCrowds/vue-pybossa-frontend/status.svg)](https://david-dm.org/LibCrowds/vue-pybossa-frontend)
[![devDependencies Status](https://david-dm.org/LibCrowds/vue-pybossa-frontend/dev-status.svg)](https://david-dm.org/LibCrowds/vue-pybossa-frontend?type=dev)

> A Vue.js-based frontend for PyBossa

## Configuring

``` bash		
# create a site config file (then edit as required)
cp src/config.js.tmpl src/config.js
```

You can also modify various pages by adding the following files to
[src/custom](src/custom):

- **background.png:** Main background image.
- **about.md:** Text for the main section of the about page.
- **technology.md:** Text for the technology section of the about page.

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
