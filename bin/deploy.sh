#!/usr/bin/env bash
if [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  echo "Clearing git info"
  rm -rf .git

  echo "Configuring playbills site"
  git clone https://github.com/LibCrowds/site-settings-playbills src/custom/settings
  echo "module.exports = require('@/custom/settings/settings/config.js')" >> src/custom/config.js

  echo "Building"
  npm run build

  echo "Setting up package for sending"
  git init
  git remote add deploy "deploy@playbills.libcrowds.com:/var/www/deployment"
  git config user.name "Alex Mendes"
  git config user.email "alexanderhmendes@gmail.com"
  git add --all .
  git commit -m "Deploy from Travis - build {$TRAVIS_BUILD_NUMBER}"

  echo "Setting up permissions"
  echo -e "Host playbills.libcrowds.com\n\tStrictHostKeyChecking no" >> ~/.ssh/config
  openssl aes-256-cbc -K $encrypted_1cd83addbd20_key -iv $encrypted_1cd83addbd20_iv -in deploy-key.enc -out deploy-key -d
  eval "$(ssh-agent -s)"
  chmod 600 deploy_key
  ssh-add deploy_key

  echo "Deploying"
  git push -f deploy
else
  echo "Not deploying as this is not the master branch"
fi