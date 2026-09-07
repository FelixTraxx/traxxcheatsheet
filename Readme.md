## Overview
This website displays cheatsheets for various cli commands. The first cheatsheet will be for the salesforce cli. 

## Home page
The homepage will list the the links to the different cli cheat sheet pages

## Salesforce cli cheat sheet page
List the most used commands

**Create a project directory**

sf project generate --name &lt;Project Directory Name&gt;

**Authorize an Org using a Browser**

sf org login web --alias &lt;Org Alias&gt;

**Authorize an Org making it the default org**

sf org login web --alias &lt;Org Alias&gt; --set-default

**Create Scratch org that expires after 30 days**

sf org create scratch --duration-days=30 --alias &lt;Org Alias&gt; --set-default --target-dev-hub

**Retrieve source from org preview**

sf project retrieve preview

**Actually retrieve source from org**

sf project retrieve start

**Deploy changed source to org**

sf project deploy start

**Update version of the Salesforce cli**

sf update

**Delete a scratch org**

sf org delete scratch --target-org &lt;Scratch Org Alias&gt;

**List your orgs**

sf org list

**Open the Org in the default browser**

sf org open

**Set your default org**

sf config set target-org &lt;Org Alias&gt;

**Set your default DevHub org**

sf config set target-dev-hub=&lt;DevHub Org Alias&gt;