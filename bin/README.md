# Deployments

We're running a continuous deployment process to push vue-pybossa-frontend
updates out to all specified LibCrowds servers.

Here are some notes to help configure a new server:

``` bash
# install node and npm
sudo apt-get install python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs

# install nginx
sudo apt-get install nginx

# remove default nginx config
sudo rm /etc/nginx/sites-available/default

# create nginx config (copy /contrib/frontend)
vim /etc/nginx/sites-available/frontend

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

# create a post-receive hook (copy /contrib/post-receive)
cd hooks
vim post-receive

# make the script executable
chmod +x /var/www/deployment/.git/hooks/post-receive

# create a user with restricted access
adduser deploy

# give that user ownership
chown -R deploy:deploy /var/www/deployment/.git
chown -R deploy:deploy /var/www/frontend

# switch to that user
su - deploy

# create the public key (copy /contrib/deploy-key.pub)
mkdir ~/.ssh
vim ~/.ssh/authorized_keys

# restrict permissions
chmod 700 .ssh
chmod 600 .ssh/authorized_keys
```

You can now exit the server and modify [/bin/deploy.sh](/bin/deploy.sh) accordingly.
