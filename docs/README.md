# vue-pybossa-frontend

[![Build Status](https://travis-ci.org/LibCrowds/vue-pybossa-frontend.svg?branch=master)](https://travis-ci.org/LibCrowds/vue-pybossa-frontend)
[![DOI](https://zenodo.org/badge/92406558.svg)](https://zenodo.org/badge/latestdoi/92406558)

> A Vue.js frontend for PyBossa (>=2.6.1).

This frontend to PyBossa is a little different in that microsites can be defined to more easily group together large groups of similar projects. For example, on the [LibCrowds](www.libcrowds.com) site we define a meta-category for two of our major projects, *Convert-a-Card* and *In the Spotlight*.

Each microsite is presented as if it were a separate site (with it's own landing, about and data pages etc.) yet only requires a single PyBossa backend.

## Installation

Install [Node.js >=5.0.0](https://nodejs.org/en/), then:

``` bash
# install dependencies
npm install
```

## Usage

On your PyBossa server, you will need to update the `CORS_RESOURCES` settings to allow requests from vue-pybossa-frontend. Something like this (modify origins according to your environement):

``` python
CORS_RESOURCES = {
  r"/*": {
    "origins": [
      "http://127.0.0.1:8080"
    ],
    "allow_headers": [
      'Content-Type',
      'Authorization',
      'X-CSRFToken'
    ],
    "supports_credentials": True
  }
}
```

For a full list of options see the [Flask-CORS documentation](https://flask-cors.readthedocs.io/en/latest/).

You must modify the following in your PyBossa settings:

| Setting                     | Value             |
|-----------------------------|-------------------|
| CATEGORY_INFO_PUBLIC_FIELDS | ['collection']    |
| USER_INFO_PUBLIC_FIELDS     | ['announcements'] |


Now, see the [Configuration](configuration.md) section for details of how to configure the site and each microsite.

## Building

To build locally:

``` bash
# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Testing

To run tests:

``` bash
# run unit tests
npm unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Developing

Start up a local PyBossa instance using the default settings, then:

``` bash
# serve with hot reload at 127.0.0.1:8080
npm run dev
```

Note that for cookies to be read properly you must access the website at http://127.0.0.1:8080, rather than http://localhost:8080.
