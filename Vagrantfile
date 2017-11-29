# -*- mode: ruby -*-
# vi: set ft=ruby :

# LibCrowds Vagrantfile

VAGRANTFILE_API_VERSION = "2"

# Ansible install script for Ubuntu
$ansible_install_script = <<SCRIPT
export DEBIAN_FRONTEND=noninteractive
echo Checking if Ansible exists...
if ! which ansible >/dev/null; then
  echo Updating package index files...
  apt-get update -qq
  echo Installing Ansible...
  apt-get install -qq ansible
fi
SCRIPT

$ansible_local_provisioning_script = <<SCRIPT
export DEBIAN_FRONTEND=noninteractive
export PYTHONUNBUFFERED=1
echo Applying Ansible hosts fix for Windows...
mkdir -p /home/vagrant/
cp /vagrant/provisioning/hosts /home/vagrant/
chmod 666 /home/vagrant/hosts
echo Provisioning with Ansible...
ansible-playbook /vagrant/provisioning/playbook.yml -i /home/vagrant/hosts -c local
SCRIPT

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"
  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
  end

  # Disable proxy for localhost (if plugin installed)
  if Vagrant.has_plugin?("vagrant-proxyconf")
    config.proxy.no_proxy = "localhost,127.0.0.1"
  end

  # Forward port
  config.vm.network :forwarded_port, host: 8080, guest: 8080

  # turn off warning message `stdin: is not a tty error`
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

  # Ensure Ansible exists for local provisioning
  config.vm.provision "shell", inline: $ansible_install_script

  # Run Ansible local provisioning
  config.vm.provision "shell", inline: $ansible_local_provisioning_script
end