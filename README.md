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

Settings can be found in [src/config.js.tmpl](src/config.js.tmpl). To use
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

## Testing

``` bash
# run unit tests
npm unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

CI end-to-end tests are run using BrowserStack, a cross browser and
real device web-based testing platform.

[![BrowserStack Logo](browserstack-logo.png)](https://www.browserstack.com)

## Developing

Start up a local PyBossa instance using the default settings, then:

``` bash
# serve with hot reload at 127.0.0.1:8080
npm run dev
```

Note that for cookies to be read properly you must access the website at
127.0.0.1:8080, rather than localhost:8080.

# Deploying

We're running a continuous deployment process to push vue-pybossa-frontend
updates out to all LibCrowds servers that use it. To configure a new server:

``` bash
# install node and npm
sudo apt-get install python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs

# install nginx
sudo apt-get install nginx

# remove default nginx config
sudo rm /etc/nginx/sites-enabled/default

# create nginx config (copy /contrib/frontend)
vim /etc/nginx/sites-enabled/frontend

# enable nginx config
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/frontend

# restart nginx
sudo service nginx restart

# create an empty repo
mkdir -p /var/www/deployment/.git
cd /var/www/deployment/.git
git init --bare

# create an empty directory for deployments
mkdir /var/www/frontend

# create a post-receive hook (copy /contrib/post-receive)
cd hooks
vim post-receive

# make the script executable
chmod +x /var/www/deployment/.git/hooks/post-receive

# create a user with restricted access
adduser deploy

# give that user ownerships
chown -R deploy:deploy /var/www/deployment/.git
chown -R deploy:deploy /var/www/frontend

# switch to that user
su - deploy

# create the public key (copy /contrib/deploy-key.pub)
mkdir -p ~/.ssh/authorized_keys
chmod 700 .ssh
vim .ssh/authorized_keys/deploy-key.pub

# restrict permissions to authorized_keys
chmod 600 .ssh/authorized_keys
```

You can now exit the server and add the site to the `SITES` variable at the
top of [/bin/deploy.sh](/bin/deploy.sh).

Once the master branch has been updated with this change it will be deployed to
the new site for the first time.
