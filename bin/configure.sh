#!/usr/bin/env bash

# Core site settings
SITESETTINGS="https://github.com/LibCrowds/site-settings-core"

# List of collections configurations in the form "name:settings"
COLLECTIONSSETTINGS=(
  "playbills:https://github.com/LibCrowds/site-settings-playbills"
  "convertacard:https://github.com/LibCrowds/site-settings-convertacard"
)

# Configure site
rm src/settings/siteConfig.js
git clone $SITESETTINGS src/settings/tmp
mv src/settings/tmp/config.js src/settings/siteConfig.js
rm -rf src/settings/tmp

# Configure projects
rm -rf src/settings/collections/*/
for project in "${COLLECTIONSSETTINGS[@]}"; do
  NAME="${project%%:*}"
  SETTINGS="${project/$NAME:/}"
  git clone $SETTINGS src/settings/collections/$NAME
done
