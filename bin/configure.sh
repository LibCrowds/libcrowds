#!/usr/bin/env bash

# List of project configurations in the form "name:settings"
PROJECTSETTINGS=(
  "playbills:https://github.com/LibCrowds/site-settings-playbills"
)

# Configure site
rm src/settings/siteConfig.js
cp src/settings/siteConfig.js.tmpl src/settings/siteConfig.js

# Configure projects
rm -rf src/settings/projects/*/
for project in "${PROJECTSETTINGS[@]}"; do
  NAME="${project%%:*}"
  SETTINGS="${project/$NAME:/}"
  git clone $SETTINGS src/settings/projects/$NAME
done
