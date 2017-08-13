#!/usr/bin/env bash
if [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
  echo "Clear git info"
  rm -rf .git

  echo "Configure playbills site"
  git clone https://github.com/LibCrowds/site-settings-playbills src/custom
  echo "module.exports = require('@/custom/site-settings-playbills/settings/config.js')" >> src/custom/config.js

  echo "Build"
  npm run build

  echo "Set up package for sending"
  git init
  git remote add deploy "deploy@playbills.libcrowds.com:/var/www/deployment"
  git config user.name "Alex Mendes"
  git config user.email "alexanderhmendes@gmail.com"
  git add --all .
  git commit -m "Deploy from Travis - build {$TRAVIS_BUILD_NUMBER}"

  echo "Set up permissions"
  echo -e "Host playbills.libcrowds.com\n\tStrictHostKeyChecking no" >> ~/.ssh/config
  openssl aes-256-cbc -K $encrypted_a9d53792e855_key -iv $encrypted_a9d53792e855_iv -in deploy_key.pem.enc -out deploy_key.pem -d
  eval "$(ssh-agent -s)"
  chmod 600 deploy_key.pem
  ssh-add deploy_key.pem

  echo "Deploy"
  git push -f deploy
fi