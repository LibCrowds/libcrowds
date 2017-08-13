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

# install nginx
sudo apt-get install nginx

# remove default nginx config
sudo rm /etc/nginx/sites-enabled/default

# create nginx config (copy /contrib/deployment/frontend)
vim /etc/nginx/sites-enabled/frontend

# enable nginx config
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/frontend

# restart nginx
sudo service nginx restart

# create an empty repo
mkdir -p /var/www/deployment/.git
cd /var/www/deployment/.git
git init --bare

# create an empty directory for deployments
mkdir /var/www/frontend

# create a post-receive hook (copy /contrib/deployment/post-receive)
cd hooks
vim post-receive

# make the script executable
chmod +x /var/www/deployment/.git/hooks/post-receive

# create a user with restricted access
adduser deploy

# give that user ownership of the repo
chown -R deploy:deploy /var/www/deployment/.git

# switch to that user
su - deploy

# create the public key (copy /contrib/deployment/deploy-key.pub)
mkdir -p .ssh/authorized_keys
chmod 700 .ssh
vim .ssh/authorized_keys/deploy-key.pub

# restrict permissions to authorized_keys
chmod 600 .ssh/authorized_keys
```

You can now exit the server and add the site to the `SITES` variable at the
top of [/bin/deploy.sh](/bin/deploy.sh).

Once the master branch has been updated with this change it will be deployed to
the new site for the first time.
