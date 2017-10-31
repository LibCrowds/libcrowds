#!/usr/bin/env bash

SETTINGS="https://github.com/LibCrowds/libcrowds-frontend-settings"

# Configure site
rm local.config.js
rm -rf custom/*/
git clone $SETTINGS custom/settings
echo "module.exports = require('./custom/settings/siteConfig.js')" >> local.config.js
