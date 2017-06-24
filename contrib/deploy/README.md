# LibCrowds vue-pybossa-frontend deployment

As we're running a continuous deployment process to push vue-pybossa-frontend
updates out to all relevant LibCrowds servers, our build process is a bit
different.

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

# store the public key
mkdir .ssh
chmod 700 .ssh
cp contrib/deploy-key.pub .ssh/authorized_keys

# restrict permissions to authorized_keys
chmod 600 .ssh/authorized_keys

# create a post-receive hook
cd /var/www/vue-pybossa-frontend
cp contrib/post-receive .git/hooks
chmod +x post-receive
```

Save the file and exit the server.


## Modifying travis.yml

In the `after_success` section add the following line:

```
- git remote add deploy "deploy@{frontend-server-ip}:/var/www/vue-pybossa-frontend"
```

All future changes to master that successfully pass tests will now be deployed
to the remote vue-pybossa-frontend instance.
