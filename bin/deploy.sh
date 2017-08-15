#!/usr/bin/env bash

shopt -s extglob

# List of project configurations in the form "name:settings"
PROJECTSETTINGS=(
  "playbills:https://github.com/LibCrowds/site-settings-playbills"
)

DOMAIN='playbills.libcrowds.com'

if [ -z $TRAVIS_BRANCH ] || [ $TRAVIS_BRANCH == 'master' ] ; then

  # Clear git info
  rm -rf .git
  rm -rf .gitignore

  # Configure site
  rm -r src/settings/projects
  mkdir src/settings/projects
  for project in "${PROJECTSETTINGS[@]}"; do
    NAME="${project%%:*}"
    SETTINGS="${project/$NAME:/}"
    git clone $SETTINGS src/settings/projects/$NAME
  done

  # Build
  npm run build

  # Set up package for sending
  git init
  git remote add deploy "deploy@$DOMAIN:/var/www/deployment"
  git config user.name "Alex Mendes"
  git config user.email "alexanderhmendes@gmail.com"
  git add dist/*
  git commit -m "Deployment"

  # Set up permissions
  echo -e "Host $DOMAIN\n\tStrictHostKeyChecking no" >> ~/.ssh/config
  openssl aes-256-cbc -K $encrypted_1cd83addbd20_key -iv $encrypted_1cd83addbd20_iv -in deploy-key.enc -out deploy-key -d
  eval "$(ssh-agent -s)"
  chmod 600 deploy-key
  ssh-add deploy-key

  # Deploy
  git push -f deploy master
else
  echo "Not deploying as this is not the master branch"
fi
