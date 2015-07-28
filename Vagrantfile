require 'yaml'

ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'
containers = YAML.load_file('containers.yml')

Vagrant.configure("2") do |config|

  config.vm.provider "docker" do |docker|
    docker.vagrant_vagrantfile = './host/Vagrantfile'
  end

  containers.each do |container|
    config.vm.define container["name"] do |cntnr|

      cntnr.vm.synced_folder ".", "/vagrant", disabled: true

      cntnr.vm.provider "docker" do |docker|
        docker.name = container["name"]
        docker.image = container["image"]
        docker.ports = container["ports"] ||= []
        docker.volumes = container["volumes"] ||= []
      end

    end
  end

end
