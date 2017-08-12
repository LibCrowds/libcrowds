# LibCrowds vue-pybossa-frontend deployment

We're running a continuous deployment process to push vue-pybossa-frontend
updates out to all LibCrowds servers that use it, so our build process is a bit
different.

## Configuring the server

To configure a new server:

``` bash
# install node and npm
sudo apt-get install python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs

# clone
mkdir /var/www
git clone https://github.com/LibCrowds/vue-pybossa-frontend /var/www/vue-pybossa-frontend

# copy default config
cp /var/www/vue-pybossa-frontend/src/config.js.tmpl /var/www/vue-pybossa-frontend/src/config.js

# build
npm run build

# create a user with restricted access
adduser deploy

# give that user ownership of the repo
chown -R deploy:deploy /var/www/vue-pybossa-frontend

# switch to that user
su - deploy

# store the public key
mkdir -p .ssh/authorized_keys
chmod 700 .ssh
cp /var/www/vue-pybossa-frontend/contrib/deploy/deploy-key.pub .ssh/authorized_keys

# restrict permissions to authorized_keys
chmod 600 .ssh/authorized_keys

# create a post-receive hook
cp /var/www/vue-pybossa-frontend/contrib/deploy/post-receive /var/www/vue-pybossa-frontend/.git/hooks
chmod +x /var/www/vue-pybossa-frontend/.git/hooks/post-receive
```

You can now exit the server and add the following to the `after_success`
section of [.travis.yml](.travis.yml) add the following line:

``` yaml
- git remote add deploy "deploy@{frontend-server-ip}:/var/www/vue-pybossa-frontend"
```

Once the master branch has been updated with this change, all future changes to
master that pass tests will be deployed to the remote vue-pybossa-frontend
instance configured above.
