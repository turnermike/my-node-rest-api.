# My Node.js RESTful API

A learning project for dockerizing a Node.js application running on Express.


# The Stack

Docker - Used for a local development environmet and containerized deployments.
Node.js - Server side language.
MongoDB - The database server.
Express - The web server.
Webpack - Build tool for front end scripts, styles, and images.


# MongoDB Access

## Docker/CLI
Get shell access to the container:
`docker exec -it mynoderesetapi-db bash`

Login to MongDB with authentication:
`mongo -u "mynoderestapi" -p "<check_the_env_file>" --authenticationDatabase "admin"`

## MongoDB Compass Setup

Hostname: 0.0.0.0
Port: 27017
Database: mynoderestapi
Authentication: Username/Password
Username: mynoderestapi
Password: <check_the_env_file>
Authentication Database: admin


export MONGO_USERNAME=mynoderestapi &&
export MONGO_PASSWORD=password &&
export MONGO_PORT=27017 &&
export MONGO_DB=mynoderestapi &&
export MONGO_HOSTNAME=localhost


## Response Codes
200 All Good
400 Bad Request
401 Unauthorized (failed login/unauthenticated)
403 Forbidden (unauthorized/not permitted to access)
404 Not Available