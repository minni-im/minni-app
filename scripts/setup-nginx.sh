#!/bin/bash

cat > /tmp/minni.conf <<EOF
server {
    listen 80 default_server;
    listen 8000 default_server;
    server_name _;
    large_client_header_buffers 4 32k;
    client_max_body_size 50M;
    charset utf-8;
    access_log /home/$USER/logs/nginx.access.log;
    error_log /home/$USER/logs/nginx.error.log;
}
EOF

apt-install-if-needed nginx-full
sudo mv /tmp/minni.conf /etc/nginx/sites-available/minni
sudo rm -rf /etc/nginx/sites-enabled/minni
sudo rm -rf /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/minni /etc/nginx/sites-enabled/minni
sudo service nginx restart
