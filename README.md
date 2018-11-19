# Tuts+ Market Explorer

Integrates publicly-available data from Tuts+ and Envato Market for easy exploration of top-selling items and categories, along with promotions that have been published on Tuts+.

## Provisioning

To install the app:

  - install the packages (`npm install`)
  - configure the envato and server secret keys
  - scrape the item and post data
  - start the server


### Configure Secret Keys

Templates for the secret key config files are at **backend/secret/envato-secret.js.template** (the Envato API access token), **backend/secret/semrush-secret.js.template** (the Semrush API access token), and **backend/secret/server-secret.js.template** (the server username and password). Copy these to 
**backend/secret/envato-secret.js** etc. (remove the **.template** part), and fill in the required values.

### Scraping Data

Data from Tuts+ and Envato Market is scrapped from the command line and archived in CSV format in the **data** folder. It is then served up in JSON format by the back-end at the **/api/items** and **/api/posts** endpoints.

Create the data folder
    
    mkdir data

To scrape the items and posts data run

    node backend/market-items-scraper.js

and 

    node backend/tutsplus-market-links-scraper.js

These will take several minutes each to run.


### Dev Server

Uses the create-react-app hot reloading dev server on port 3000, which proxies to the back-end Express server on port 8080.

    node backend/server.js & npm start


### Production Server

Build the front-end with create-react-app and launch the server.

    npm run build
    node backend/server.js


### Low-memory environments

On a low-memory machine, eg. a DigitalOcean 512MB instance, you will need to enable virtual memory. Use this guide:

[How To Configure Virtual Memory (Swap File) on a VPS](https://www.digitalocean.com/community/tutorials/how-to-configure-virtual-memory-swap-file-on-a-vps#2)


### Start on boot

To make the application start on boot, run the following:

    # initialize pm2 to start on boot with the systemd boot manager
    pm2 startup systemd
    
    # start the app with pm2
    pm2 start node --name tutsplus-market-explorer -- backend/server.js
    
    # save the current pm2 config so that it can be reloaded on boot
    pm2 save

 [Digital Ocean: How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)