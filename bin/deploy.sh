#!/usr/bin/env bash

# List of sites in the form ["domain"]="settings"
SITES=(
  ["playbills.libcrowds.com"]="https://github.com/LibCrowds/site-settings-playbills"
)

if [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  for site in "${!SITES[@]}"; do
    echo "Deploying to $site"

    # Clear git info
    rm -rf .git

    # Configure site
    git clone ${SITES[$site]} src/custom/settings
    echo "module.exports = require('@/custom/settings/settings/config.js')" >> src/custom/config.js

    # Build
    npm run build

    # Set up package for sending
    git init
    git remote add deploy "deploy@$site:/var/www/deployment"
    git config user.name "Alex Mendes"
    git config user.email "alexanderhmendes@gmail.com"
    git add --all .
    git commit -m "Deploy from Travis - build {$TRAVIS_BUILD_NUMBER}"

    # Set up permissions
    echo -e "Host $site\n\tStrictHostKeyChecking no" >> ~/.ssh/config
    openssl aes-256-cbc -K $encrypted_1cd83addbd20_key -iv $encrypted_1cd83addbd20_iv -in deploy-key.enc -out deploy-key -d
    eval "$(ssh-agent -s)"
    chmod 600 deploy_key
    ssh-add deploy_key

    # Deploy
    git push -f deploy
  done
else
  echo "Not deploying as this is not the master branch"
fi