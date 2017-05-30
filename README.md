# libcrowds-spa-theme

[![Build Status](https://travis-ci.org/LibCrowds/libcrowds-spa-theme.svg?branch=master)](https://travis-ci.org/LibCrowds/libcrowds-spa-theme)
[![dependencies Status](https://david-dm.org/LibCrowds/libcrowds-spa-theme/status.svg)](https://david-dm.org/LibCrowds/libcrowds-spa-theme)
[![devDependencies Status](https://david-dm.org/LibCrowds/libcrowds-spa-theme/dev-status.svg)](https://david-dm.org/LibCrowds/libcrowds-spa-theme?type=dev)

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
```

End-to-end tests are run using BrowserStack, a cross browser and real device web-based testing platform.

[![BrowserStack Logo](browserstack-logo.png)](https://www.browserstack.com)

``` bash
# run e2e tests
export BROWSERSTACK_USERNAME=<browserstack-username>
export BROWSERSTACK_ACCESS_KEY=<browserstack-access-key>
npm run e2e
```

## Developing

Start up a local PyBossa instance as per the [documentation](http://docs.pybossa.com/en/latest/), then:
``` bash
# serve with hot reload at localhost:8080
npm run dev
```

Note that the PyBossa should be run with the default settings at http://localhost:5000.


## Deploying

``` bash
# deploy to gh-pages
npm run gh-pages
```
