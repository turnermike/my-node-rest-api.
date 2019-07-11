# Containerizing a Node.js Application for Development With Docker Compose

Tutorial: [https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose](https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose)
Source Code: [https://github.com/do-community/nodejs-mongo-mongoose](https://github.com/do-community/nodejs-mongo-mongoose)

## MongoDB Access

Get shell access to the container:

`docker exec -it db bash`

Login to MongDB with authentication:

`mongo -u "sammy" -p "<check_the_env_file>" --authenticationDatabase "admin"`

MongoDB Compass Setup:

Hostname: 0.0.0.0.
Port: 27017.
Authentication: Username/Password.
Username: sammy.
Password: <check_the_env_file>.
Authentication Database: admin.

