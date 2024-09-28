# How to Deploy a Node.js Application on Oracle Cloud Infrastructure (for macOS and Linux Users)
### Key Technologies Briefing

- **Oracle Cloud Infrastructure**: Provides a robust, scalable cloud environment for deploying applications. [Learn more](https://docs.oracle.com/en-us/iaas/developer-tutorials/tutorials/node-on-ol/01oci-ol-node-summary.htm).

- **Oracle Cloud Autonomous Database**: Offers fully automated database services optimized for transaction processing, data warehousing, and mixed workloads. [Learn more](https://www.oracle.com/autonomous-database/free-trial/?source=:ow:o:p:feb:::Nov2023ADBGetStartPage&intcmp=:ow:o:p:feb:::Nov2023ADBGetStartPage).

- **Node Version Manager (NVM)**: Manages multiple Node.js environments for versatile project requirements. [Learn more](https://github.com/nvm-sh/nvm).

- **Process Manager 2 (PM2)**: Keeps Node.js applications online and facilitates administration. [Learn more](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).

- **NGINX**: An efficient and flexible web server and reverse proxy that improves the scalability, reliability, and security of applications. [Learn more](https://www.nginx.com/).

- **Certbot/Let's Encrypt**: Provides free SSL certificates to ensure secure HTTPS connections for your applications. [Learn more](https://certbot.eff.org/).

### 1. Create an Instance and Configure Ingress Rules
Create an OCI instance and configure security rules to allow traffic to the application. These rules will enable access to the Node.js application, NGINX reverse proxy, and the domain name for HTTPS.
- Go to the [OCI Compute Instances](https://cloud.oracle.com/compute/instances)  page and create a new instance.
- Download the public and private SSH keys.
- Add three ingress rules, follow these steps:
  - Navigate to the page of your instance.
  - Look for the section labeled "Resources" and click on "Attached VNICs".
  - Click on the subnet associated with your instance.
  - Edit the "Default Security List" by clicking on it.
  - Add new rules:
    - First rule
      - Set the source IP to `0.0.0.0/0`.
      - Set the destination port range to `3000`.
      - Set description to NODEJS
    - Second rule
      - Set the source IP to `0.0.0.0/0`.
      - Set the destination port range to `8080`.
      - Set description to NGINX
    - Third rule
      - Set the source IP to `0.0.0.0/0`.
      - Set the destination port range to `80`.
      - Set description to DOMAIN
    - Fourth rule
      - Set the source IP to `0.0.0.0/0`.
      - Set the destination port range to `443`.
      - Set description to Allow HTTPS traffic
#### Explanation of Ingress Rule Settings
- Source IP 0.0.0.0/0: Allows traffic from any IP address, making the application accessible from anywhere on the internet.
- Port Ranges:
  - Port 3000: Default port for Node.js applications.
  - Port 8080: Common port for HTTP proxy servers like NGINX.
  - Port 80: Default port for HTTP traffic.
  - Port 443: Allows HTTPS traffic

### 2. Setting Up SSH Access
Configure SSH access to securely connect to your OCI instance.
Open your Terminal and run the following commands to set up SSH access
  ```bash
  # Ensure you are in your home directory
  cd ~

  # Navigate to or create the .ssh directory and set up folders for organizing OCI keys
  mkdir -p ~/.ssh/oci/opc && cd ~/.ssh/oci/opc

  # Copy and rename your downloaded public and private keys into the created folders
  cp /path/to/your/downloaded/private_key.pem id_rsa.key
  cp /path/to/your/downloaded/public_key.pem id_rsa.pub
  chmod 600 id_rsa.key id_rsa.pub  # Restricts access to the key files

  # Create or modify the config file in .ssh to streamline SSH connections
  cat << EOF > ~/.ssh/config
  Host *
    ServerAliveInterval 300
    ServerAliveCountMax 2

  Host oracle-compute-01
    HostName 129.153.34.97  # Replace with your instance's public IP
    User opc
    IdentityFile ~/.ssh/oci/opc/id_rsa.key
  EOF
  ```
 
Your `.ssh` directory should look like this:
  ```bash
    ├── config
    └── oci
        └── opc
            ├── id_rsa.key
            └── id_rsa.pub
  ```


This configuration ensures stable SSH connections and simplifies SSH connections to the host `oracle-compute-01`.


### 3. Configuring Firewall, SSH Access, and Swap File
Ensure secure access, configure firewall settings, and enhance system performance with a swap file.
  ```bash
  # Add a new user named 'node'
  sudo useradd node

  # Connect to the instance using SSH
  ssh oracle-compute-01

  # Verify that HTTP and HTTPS protocols are allowed in your firewall
  sudo firewall-cmd --get-services

  # Add ports 3000, 8080, and 80 to allowed services to accommodate your application's needs
  sudo firewall-cmd --permanent --add-port=3000/tcp  # Allow port 3000 for the Node.js application
  sudo firewall-cmd --permanent --add-port=8080/tcp  # Allow port 8080 for NGINX
  sudo firewall-cmd --permanent --add-port=80/tcp  # Allow port 80 for the domain
  sudo firewall-cmd --permanent --add-port=443/tcp  # Allow port 443 for the HTTPS traffic

  # Reload the firewall to apply changes
  sudo firewall-cmd --reload

  # Create a 2GB swap file
  sudo dd if=/dev/zero of=/swapfile2 bs=1M count=2048

  # Set correct permissions for the swap file
  sudo chmod 600 /swapfile2

  # Setup the swap space
  sudo mkswap /swapfile2

  # Enable the swap file
  sudo swapon /swapfile2

  # Switch to the 'node' user account for further operations
  sudo su - node
  ```

This block of commands adds a new user, configures the firewall to allow necessary ports, creates and configures a swap file for better system performance, and switches to the 'node' user for further operations.

### 4. Installing NVM 
Install Node Version Manager (NVM) to manage multiple Node.js environments for versatile project requirements.
  ```bash
  # Install NVM (Node Version Manager)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

  # Add NVM initialization to your .bashrc file if not already present
  cat << 'EOF' >> ~/.bashrc
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  EOF

  # Source your .bashrc file to load NVM
  source ~/.bashrc

  # Verify the installation of NVM
  nvm version

  # Install the LTS (Long Term Support) version of Node.js (Hydrogen) using NVM
  nvm install lts/hydrogen
  ```
We installed NVM (Node Version Manager), added the necessary initialization commands to the .bashrc file, sourced the file to load NVM, verified the installation, and then installed the LTS version of Node.js (Hydrogen).

### 5. Setting Up the Application Environment
Set up the necessary environment for your Node.js application by creating the project structure and initializing it with required configurations.

  ```bash
# Navigate to the home directory and create an application folder
mkdir ~/app && cd ~/app

# Initialize a new Node.js project with default configurations
npm init -y

# Install Express, a minimal and flexible Node.js web application framework
npm install express

# Check the package.json to ensure the dependencies are listed
cat package.json

# Modify the package.json to include a start script and specify the module type
sed -i '/"scripts": {/a \ \ \ \ "start": "node index.js",' package.json
sed -i '/^{/a "type": "module",' package.json

# Create a new file index.js with the following Express server setup
cat <<EOF > index.js
import express from "express";
import { fileURLToPath } from "url";
import { join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const app = express();
console.log(join(__dirname, "public"));

app.use(express.static(join(__dirname, "public")));
app.listen(3000, "0.0.0.0", () => console.log("Listening on port 3000"));
EOF

# Create a directory public and a index.html file with the content "Hello Node"
mkdir -p public && cat <<EOF > public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  Hello Node!
</body>
</html>
EOF
```
This block of commands sets up the application environment by creating the project structure, initializing it, installing necessary dependencies, and configuring the application.

### 6. Setting Up PM2
Configure PM2 to manage your Node.js application and ensure it starts on boot.
  ```bash
  # Go back to the parent directory to install PM2 globally
  cd ~

  # Install PM2 (Process Manager for Node.js) using npm
  npm install -g pm2

  # Generate a PM2 ecosystem file for your app configuration
  pm2 ecosystem

  # Edit the ecosystem file to match the app's specific configuration
  cat << 'EOF' > ecosystem.config.js
  module.exports = {
    apps: [{
      script: './app/index.js',
      watch: './app'
    }]
  };
  EOF

  # Generate a Startup Script
  sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $(whoami) --hp $(eval echo ~$USER)

  # Start your application with PM2 using the ecosystem config file
  pm2 start ecosystem.config.js

  # Save the current list of processes
  pm2 save

  # Become Root
  sudo su -

  # Create a Directory for the Startup Script
  sudo mkdir -p /opt/pm2-startup

  # Create the PM2 Startup Script
  cat << 'EOF' > /usr/bin/pm2-startup/pm2-startup.sh
  #!/bin/bash
  runuser -l node -c 'pm2 resurrect'
  EOF

  # Make the Script Executable
  sudo chmod +x /usr/bin/pm2-startup/pm2-startup.sh

  # Create a Systemd Service File
  cat << 'EOF' > /etc/systemd/system/pm2.service
  [Unit]
  Description=Resurrect PM2 as node
  After=network.target

  [Service]
  Type=simple
  ExecStart=/usr/bin/pm2-startup/pm2-startup.sh
  TimeoutStartSec=0

  [Install]
  WantedBy=default.target
  EOF

  # Reload Systemd to Recognize New Service
  sudo systemctl daemon-reload

  # Enable and Start the PM2 Service
  sudo systemctl enable pm2.service
  sudo systemctl start pm2.service

  # Check the Status of the PM2 Service
  sudo systemctl status pm2.service

  # Reboot the Server to Test Configuration
  sudo systemctl reboot

  # After Reboot, Connect to Your Instance and Switch to the Node User
  ssh oracle-compute-01
  sudo su - node

  # Check PM2 List to Confirm App is Running
  pm2 list
  ```
This block of code installs PM2, configures it to manage your Node.js application, ensures it starts on boot, and verifies the configuration by checking the PM2 process list after rebooting the server.

Navigate to <your_public_ip>:3000 to access the Node.js application directly.

### 7. Setting Up NGINX
Set up NGINX to act as a web server and reverse proxy for your application with basic authentication.
  ```bash
  # Navigate to the app directory
  cd ~/app

  # Edit index.js to change the listening address for proxy compatibility
  sed -i 's/app.listen(3000, "0.0.0.0"/app.listen(3000, "127.0.0.1"/' index.js

  # Add link to admin.html in index.html
  echo '<a href="admin.html">Go to admin</a>' >> public/index.html

  # Create an admin.html file with the content "Hello Admin"
  cat <<EOF > public/admin.html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Page</title>
  </head>
  <body>
    Hello Admin!
  </body>
  </html>
  EOF

  # Clean all cached files from any repo that are stored on the system
  sudo dnf clean all

  # Install NGINX to act as a web server and reverse proxy
  sudo dnf install nginx

  # Install necessary tools for NGINX authentication
  sudo dnf install httpd-tools -y

  # Create and set up a password file for NGINX authentication
  sudo htpasswd -c /etc/nginx/.htpasswd node
  sudo chown nginx:nginx /etc/nginx/.htpasswd 
  sudo chmod 644 /etc/nginx/.htpasswd

  # Verify the contents of the password file
  cat /etc/nginx/.htpasswd 

  # Edit NGINX configuration file
  sudo nano /etc/nginx/nginx.conf

  # Insert the server configuration into nginx.conf
  cat <<EOF | sudo tee -a /etc/nginx/nginx.conf
  server {
      listen 8080;
      server_name _;
      root /usr/share/nginx/html;

      location / {
          root /home/node/app/public;
          index index.html index.htm;
          proxy_pass http://127.0.0.1:3000/;
          proxy_http_version 1.1;
          proxy_set_header Upgrade \$http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host \$host;
          proxy_cache_bypass \$http_upgrade;
      }

      location /admin {
          proxy_pass http://127.0.0.1:3000/admin;
          proxy_http_version 1.1;
          proxy_set_header Upgrade \$http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host \$host;
          proxy_cache_bypass \$http_upgrade;
          auth_basic "Administrator’s Area";
          auth_basic_user_file /etc/nginx/.htpasswd;
      }
  }
  EOF

  # Set SELinux boolean to allow NGINX to make network connections
  sudo setsebool -P httpd_can_network_connect 1

  # Verify the SELinux boolean is set correctly
  getsebool httpd_can_network_connect

  # Test NGINX configuration for any errors
  sudo nginx -t

  # Reload NGINX to apply changes
  sudo systemctl reload nginx

  # Ensure NGINX is enabled to start on boot and is running
  sudo systemctl enable nginx
  sudo systemctl start nginx

  # Check the status of NGINX to ensure it's active and running
  sudo systemctl status nginx
  ```
Access Your Application: Try accessing both the main application and the /admin section through your web browser using <your-server-ip>:8080 and<your-server-ip>:8080/admin respectively. Ensure that the authentication prompt appears for the /admin path.

By following these steps, you will have set up NGINX to serve your application, with proper authentication and configurations in place.

### 8. Purchase a Domain (Optional)
To configure your Node.js application to use a custom domain, ensuring that it listens for standard HTTP requests and forwards them appropriately to the Node.js server via NGINX.

- First with your DNS porvider of your preference set "IPv4 address" field, to the public IP address of your Oracle instance.
- Edit your NGINX config file
  ```bash
  # Open your NGINX configuration file
  sudo nano /etc/nginx/nginx.conf

  # Add the following server configuration to nginx.conf
  server {
      listen       80;  # Listen on port 80 for standard HTTP requests
      server_name  <CHANGE WITH CUSTOM DOMAIN>;  # Update to use your specific domain

      root         /usr/share/nginx/html;

      # (Other location configurations here)
  }

  # Test the NGINX configuration for any errors
  sudo nginx -t

  # Reload NGINX to apply changes
  sudo nginx -s reload
  ```

We updated the NGINX configuration to listen for HTTP requests on port 80 and use the custom domain. After editing the configuration, we tested and reloaded NGINX to apply the changes.


#### 9. Let's Encrypt
Set up Let's Encrypt to provide free SSL certificates for your domain, ensuring secure HTTPS connections for your Node.js application.

  ```bash
  # Add the EPEL Repository
  sudo dnf install epel-release
  sudo dnf install oracle-epel-release-el8

  # Add a Third-Party Repository
  sudo dnf config-manager --add-repo=https://download.fedoraproject.org/pub/epel/8/Everything/x86_64

  # Install Snapd
  sudo dnf clean all
  sudo dnf makecache
  sudo dnf install snapd

  # Manually Download and Import the GPG Key
  curl -O https://dl.fedoraproject.org/pub/epel/RPM-GPG-KEY-EPEL-8
  sudo rpm --import RPM-GPG-KEY-EPEL-8

  # Enable and Start Snapd Service
  sudo systemctl enable --now snapd.socket

  # Create a Symbolic Link
  sudo ln -s /var/lib/snapd/snap /snap

  # Initialize Snapd
  sudo systemctl restart snapd
  sudo systemctl enable snapd

  # Install and Refresh Core Snap
  sudo snap install core
  sudo snap refresh core

  # Install Certbot
  sudo snap install --classic certbot

  # Create Symlink for Certbot
  sudo ln -s /snap/bin/certbot /usr/bin/certbot

  # Run Certbot
  sudo certbot --nginx -d <your_domain> -d www.<your_domain>

  # Verify NGINX Configuration
  # Edit NGINX Configuration
  sudo nano /etc/nginx/nginx.conf
  user nginx;
  worker_processes auto;
  error_log /var/log/nginx/error.log;
  pid /run/nginx.pid;

  include /usr/share/nginx/modules/*.conf;

  events {
      worker_connections 1024;
  }

  http {
      log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

      access_log /var/log/nginx/access.log main;

      sendfile on;
      tcp_nopush on;
      tcp_nodelay on;
      keepalive_timeout 65;
      types_hash_max_size 2048;

      include /etc/nginx/mime.types;
      default_type application/octet-stream;

      include /etc/nginx/conf.d/*.conf;

      server {
          listen 443 ssl;
          server_name <your_domain> www.<your_domain>;

          ssl_certificate /etc/letsencrypt/live/<your_domain>/fullchain.pem;
          ssl_certificate_key /etc/letsencrypt/live/<your_domain>/privkey.pem;
          include /etc/letsencrypt/options-ssl-nginx.conf;
          ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

          root /usr/share/nginx/html;

          location / {
              root /home/node/app/public;
              index index.html index.htm;
              proxy_pass http://127.0.0.1:3000/;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
          }

          location /admin {
              proxy_pass http://127.0.0.1:3000/admin;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
              auth_basic "Administrator’s Area";
              auth_basic_user_file /etc/nginx/.htpasswd;
          }

          error_page 404 /404.html;
          location = /40x.html {}

          error_page 500 502 503 504 /50x.html;
          location = /50x.html {}
      }

      server {
          listen 80;
          server_name <your_domain> www.<your_domain>;

          if ($host = www.<your_domain>) {
              return 301 https://$host$request_uri;
          }

          if ($host = <your_domain>) {
              return 301 https://$host$request_uri;
          }

          return 404;
      }
  }

  # Reload NGINX
  sudo systemctl reload nginx

  # Automated Renewal
  sudo certbot renew --dry-run
  ```
We've set up Let's Encrypt SSL certificates for your domain, configured NGINX to handle HTTPS traffic, and ensured automated renewal for the certificates. Now, your Node.js application is securely accessible over HTTPS using your custom domain.

### 10. How to Connect to an Oracle Cloud Database

This guide will walk you through the steps to connect to an Oracle Autonomous Database instance, set up your project, and deploy it on an Oracle Cloud Infrastructure (OCI) instance.


- **Create the Oracle Autonomous Database Instance**
   - Log in to your Oracle Cloud account.
   - Navigate to the Autonomous Database section.
   - Click on the button `Create Autonomous Database`.
   - Follow the on-screen instructions to configure your database.
   - Access the Autonomous Database profile.
   - Click on the button `Database Connection`.
   - Download the wallet.
   - Create a generated app through the Oracle CLI.

- **Modify the Script**
   - Ensure the script points to the correct wallet path and uses the appropriate credentials.
   - Modify the generated app as follows:

```bash
# Your working directory would look like this
# ├── README.md
# ├── index.js (NEW FILE)
# ├── package-lock.json
# ├── package.json (MODIFY)
# ├── public
# │   ├── admin.html (NEW FILE)
# │   ├── images
# │   │   ├── javascript.svg
# │   │   └── oracle-o.svg
# │   ├── index.html (NEW FILE)
# │   ├── main.js
# │   └── style.css
# ├── server
# │   ├── index.cjs
# │   ├── routes
# │   │   └── connection.cjs
# │   └── utils
# │       ├── db
# │       │   ├── config.cjs
# │       │   ├── index.cjs
# │       │   └── wallet
# │       │       ├── README
# │       │       ├── cwallet.sso
# │       │       ├── ewallet.p12
# │       │       ├── ewallet.pem
# │       │       ├── keystore.jks
# │       │       ├── ojdbc.properties
# │       │       ├── sqlnet.ora
# │       │       ├── tnsnames.ora
# │       │       └── truststore.jks
# │       └── rest-services
# │           └── connection.cjs
# └── vite.config.js

# index.js
cat << 'EOF' > index.js
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import routes from './server/routes/connection.cjs'; // Use import instead of require

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use(express.static(join(__dirname, "public")));

app.use('/api/connection', routes);

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send({
    errorCode: err.code,
    errorMessage: err.message
  });
});

app.listen(port, "127.0.0.1", () => console.log(`Listening on port ${port}`));
EOF

# public/index.html
cat << 'EOF' > public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Database App</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div id="app">
    <div>
      <a href="https://www.oracle.com/database/" target="_blank">
        <img src="/images/oracle-o.svg" class="logo" alt="Oracle O Logo" />
      </a>
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
        <img src="/images/javascript.svg" class="logo vanilla" alt="JavaScript Logo" />
      </a>
      <h1 id="response"></h1>
      <p class="read-the-docs">
        Click on the Javascript or Oracle logo to learn more
        <a href="admin.html">Go to admin</a>
      </p>
    </div>
  </div>
  <script type="module" src="/main.js"></script>
</body>
</html>
EOF

# public/admin.html
cat << 'EOF' > public/admin.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Page</title>
</head>
<body>
  Hello Admin!
</body>
</html>
EOF

# package.json
cat << 'EOF' > package.json
{
  "name": "app",
  "version": "1.0.0",
  "description": "A simple database application",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "concurrently --names server,client --prefix-colors blue,yellow --success all --kill-others 'node ./server/index.cjs' 'vite'",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives",
    "preview": "vite preview"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "morgan": "^1.10.0",
    "oracledb": "^6.2.0"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "eslint": "^8.57.0",
    "eslint-plugin-node": "^11.1.0",
    "vite": "^5.0.8"
  }
}
EOF

tar -czvf app.tar.gz app  # Compress the project directory into a .tar.gz file

scp -i /<your_key_path>/id_rsa.key app.tar.gz opc@<your_ip>:/home/opc/  # Securely copy the compressed file to your OCI instance

ssh -i /<your_key_path>/id_rsa.key opc@<your_ip>  # Log into your OCI instance using SSH

sudo mv /home/opc/app.tar.gz /home/node/  # Move the compressed file to the node user's home directory

sudo chown node:node /home/node/app.tar.gz  # Change ownership of the file to the node user

sudo su - node  # Switch to the node user

sudo rm -d app # Delete your previous app 

tar -xzf app.tar.gz  # Decompress the .tar.gz file

cd ./app  # Change to the app directory

npm install  # Install dependencies

cd ..  # Change to the parent directory

nano ecosystem.config.js  # Open the configuration file in a text editor
module.exports = {
  apps: [{
    name: 'app',
    script: './app/index.js',
    cwd: './app', # Add the location of the current directory
    watch: true
  }]
};

pm2 delete all  # Delete all previous pm2 processes

pm2 start ecosystem.config.js  # Start the app using pm2
```
We created an Oracle Autonomous Database instance, downloaded the necessary wallet, and set up a Node.js project with relevant files and dependencies. The project was then packaged, securely copied to an Oracle Cloud instance, and deployed. Environment setup and application launch were managed using pm2 for process management.