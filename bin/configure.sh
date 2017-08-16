#!/usr/bin/env bash

shopt -s extglob

# List of project configurations in the form "name:settings"
PROJECTSETTINGS=(
  "playbills:https://github.com/LibCrowds/site-settings-playbills"
)

# Configure site
rm src/settings/config.js
cp src/settings/config.js.tmpl src/settings/config.js

# Configure projects

for project in "${PROJECTSETTINGS[@]}"; do
  NAME="${project%%:*}"
  SETTINGS="${project/$NAME:/}"
  git clone $SETTINGS src/settings/projects/$NAME
done
