#!/usr/bin/env bash

shopt -s extglob

# List of sites in the form "domain:settings"
SITES=(
  "playbills.libcrowds.com:https://github.com/LibCrowds/site-settings-playbills"
)

if [ -z $TRAVIS_BRANCH ] || [ $TRAVIS_BRANCH == 'master' ] ; then
  for site in "${SITES[@]}"; do

    DOMAIN="${site%%:*}"
    SETTINGS="${site/$DOMAIN:/}"

    # Clear git info
    rm -rf .git

    # Configure site
    git clone $SETTINGS src/custom/settings
    echo "module.exports = require('@/custom/settings/settings/config.js')" >> src/custom/config.js

    # Build
    npm run build

    # Remove everything but the dist folder
    rm -r -- !(dist)

    # Set up package for sending
    git init
    git remote add deploy "deploy@$DOMAIN:/var/www/deployment"
    git config user.name "Alex Mendes"
    git config user.email "alexanderhmendes@gmail.com"
    git add --all .
    git commit -m "Deployment"

    # Set up permissions
    echo -e "Host $DOMAIN\n\tStrictHostKeyChecking no" >> ~/.ssh/config
    openssl aes-256-cbc -K $encrypted_1cd83addbd20_key -iv $encrypted_1cd83addbd20_iv -in deploy-key.enc -out deploy-key -d
    eval "$(ssh-agent -s)"
    chmod 600 deploy-key
    ssh-add deploy-key

    # Deploy
    git push -f deploy master
  done
else
  echo "Not deploying as this is not the master branch"
fi
