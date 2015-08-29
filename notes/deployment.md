## Notes RE deployment

# Development
* Modulus - MongoDB 
* Heroku - PostgreSQL
* Nodejitsu - not available anymore (bought by GoDaddy)

Keep MySQL on RAX server..
or: Openshift by RedHat

Openshift: 
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080; 
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'; 

# Production
We should be using something more robust and scalable (Rackspace)

https://developer.rackspace.com/docs/cloud-servers/getting-started/?lang=node.js
https://github.com/pkgcloud/pkgcloud/blob/master/docs/providers/rackspace/compute.md
