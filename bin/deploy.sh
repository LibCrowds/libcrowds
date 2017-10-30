#!/usr/bin/env bash

MASTER='www.libcrowds.com'
STAGING='dev.libcrowds.com'

if [ "${TRAVIS_BRANCH}" == "master" -a "$TRAVIS_PULL_REQUEST" = "false" ] || [ "${TRAVIS_BRANCH}" == "dev" -a "$TRAVIS_PULL_REQUEST" = "false" ] ; then

  # Build
  npm run build

  # Clear git info
  rm -rf .git
  rm -rf .gitignore

  # Set up package for sending
  git init

  if [ "${TRAVIS_BRANCH}" == "master" ] ; then
    git remote add deploy "deploy@$MASTER:/var/www/deployment"
  else
    git remote add deploy "deploy@$STAGING:/var/www/deployment"
  fi

  git config user.name "Alex Mendes"
  git config user.email "alexanderhmendes@gmail.com"
  git add .nuxt/dist/*
  git commit -m "Deployment"

  # Set up permissions
  if [ "${TRAVIS_BRANCH}" == "master" ] ; then
    echo -e "Host $MASTER\n\tStrictHostKeyChecking no" >> ~/.ssh/config
  else
    echo -e "Host $STAGING\n\tStrictHostKeyChecking no" >> ~/.ssh/config
  fi

  openssl aes-256-cbc -K $encrypted_1cd83addbd20_key -iv $encrypted_1cd83addbd20_iv -in deploy-key.enc -out deploy-key -d
  eval "$(ssh-agent -s)"
  chmod 600 deploy-key
  ssh-add deploy-key

  # Deploy
  git push -f deploy master
else
  echo "Not deploying as this is not the master or development branch"
fi
