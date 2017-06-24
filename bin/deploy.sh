#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    # Initialise a new git repo in dist
    cd dist
    git init

    # Add remote LibCrowds repos here
    git remote add deploy "deploy@playbills.libcrowds.com:/var/www/vue-pybossa-frontend"

    # Configure git
    git config user.name "Alex Mendes"
    git config user.email "alexanderhmendes@gmail.com"

    # Deploy
    git add .
    git commit -m "Deploy"
    git push --force deploy master
else
    echo "Not deploying, since this branch isn't master."
fi
