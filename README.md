# vue-pybossa-frontend

[![Build Status](https://travis-ci.org/LibCrowds/vue-pybossa-frontend.svg?branch=master)](https://travis-ci.org/LibCrowds/vue-pybossa-frontend)
[![dependencies Status](https://david-dm.org/LibCrowds/vue-pybossa-frontend/status.svg)](https://david-dm.org/LibCrowds/vue-pybossa-frontend)
[![devDependencies Status](https://david-dm.org/LibCrowds/vue-pybossa-frontend/dev-status.svg)](https://david-dm.org/LibCrowds/vue-pybossa-frontend?type=dev)

> A Vue.js frontend for PyBossa (>=2.5.0).

When no task presenter is present for a project 100 new tasks will be retrieved
for the user and the info fields of those tasks passed directly to an instance of [LibCrowds Viewer](https://github.com/LibCrowds/libcrowds-viewer). The
annotations returned are saved as the task run.


## Installing

Install [Node.js >=5.0.0](https://nodejs.org/en/), then:

``` bash
# install dependencies
npm install
```

## Configuring

Settings can be found in [src/config.js.tmpl](src/config.js.tmpl), to use
this theme you will need to make a copy of the settings file and edit locally.

``` bash
# create local configuration file
cp src/config.js.tmpl src/config.js
```

On your PyBossa server, you will need to update the `CORS_RESOURCES` settings
to allow requests from vue-pybossa-frontend. Something like this (modify
origins according to your environement):

``` python
CORS_RESOURCES = {
  r"/*": {
    "origins": [
      "http://127.0.0.1:8080",
      "http://localhost:8080"
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

For a full list of options see the
[Flask-CORS documentation](https://flask-cors.readthedocs.io/en/latest/).

See the

## Building

``` bash
# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Deploying using nginx

Assuming this is the only application running on your server you can deploy
it like this:

``` bash
# install nginx
sudo apt-get install nginx

# copy nginx config (editting paths according to your environment)
cp contrib/vue-pybossa-frontend /etc/nginx/sites-available/.

# remove default nginx config
sudo rm /etc/nginx/sites-enabled/default

# enable
sudo ln -s /etc/nginx/sites-available/vue-pybossa-frontend /etc/nginx/sites-enabled/vue-pybossa-frontend

# restart
sudo service nginx restart
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
