# LibCrowds vue-pybossa-frontend deployment

As we're running a continuous deployment process to push vue-pybossa-frontend
updates out to all relevant LibCrowds servers, our build process is a bit
different. The following guide describes how to setup a new instance of
vue-pybossa-frontend for LibCrowds.

## Configuring the server

Login to the server, then:

```
# clone and change directory
cd /var/www
git clone https://github.com/LibCrowds/vue-pybossa-frontend
cd vue-pybossa-frontend

# install
npm install

# create a user with restricted access
adduser deploy
chown -R deploy:deploy /var/www/vue-pybossa-frontend

# switch to that user
su - deploy

# create a file to store the public key
mkdir .ssh
chmod 700 .ssh
touch .ssh/authorized_keys

# restrict permissions to authorized_keys
chmod 600 .ssh/authorized_keys
```

Copy the contents of [deploy-key.pub](deploy-key.pub) into the
authorized_keys file that you have just created and save.

Now setup a git repo for deployments:

```
# create an empty git repo
cd /var/www/vue-pybossa-frontend
mkdir .git
cd .git
git init --bare

# create a post-receive hook
touch ./hooks/post-receive
chmod +x ./hooks/post-receive
```

Copy the contents of [post-receive](post-receive) into the post-receive file
that you have just created, replacing all instances of `{site-settings-repo-name}`
with the name of a repository containing custom settings for the frontend that
you are setting up
(e.g. [site-settings-playbills](https://github.com/LibCrowds/site-settings-playbills)).

Save the file and exit the server.


## Modifying deploy.sh

The bash script [deploy.sh](/bin/deploy.sh)
