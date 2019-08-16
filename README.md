# My Node.js RESTful API

A learning project for building a Node/Express REST API.

The top of each model, controller, and middleware will document it's functionality.

## First Time Project Setup

Install node_modules:  
`npm install`  

Import the default database tables (such as roles):  
`cd db_migrations`
`./setup.sh`

## Run Project
`npm run dev`

## Routes

## Auth Routes

/api/auth - Authenticate/Login  
Request body:  
`{
    "email": "mike@humancontact.com",
    "password": "Password$1"
}`

## Users Routes

All user routes require authentication. Requests must be sent with the following
request header:  
`{
    "x-auth-token": "<JWT returned from /api/auth route>"
}`  
GET /api/users/me - Get Current User  
GET /api/users - Get All Users  
GET /api/users/:id - Get User by ID  
POST /api/users - Add New User  
Request body:  
`{
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    telephone: '',
    userRole: '<role ObjectID>'
}`  
PUT /api/users/:id - Edit User  
Request body:  
`{
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    telephone: '',
    userRole: '<role ObjectID>'
}`  
DEL /api/user/:id - Delete User



# The Stack

Node.js - Server side language.  
MongoDB - The database server.  
Express - The web server.  


# MongoDB Access

## Docker/CLI

Login to MongDB with authentication:  
`mongo -u "mynoderestapi" -p "<check_the_env_file>" --authenticationDatabase "admin"`

## MongoDB Compass Setup

Hostname: localhost  
Port: 27017  
Database: mynoderestapi  
Authentication: Username/Password  
Username: mynoderestapi  
Password: <check_the_env_file>  
Authentication Database: admin  

Command to manually set environment variables:  
`export MONGO_USERNAME=mynoderestapi &&
export MONGO_PASSWORD=password &&
export MONGO_PORT=27017 &&
export MONGO_DB=mynoderestapi &&
export MONGO_HOSTNAME=localhost`


# Tests
Using Jest for automated testing.

`npm run test`  
`npm run test:watch`


# Response Codes
200 All Good  
400 Bad Request  
401 Unauthorized (failed login/unauthenticated)  
403 Forbidden (unauthorized/not permitted to access)  
404 Not Available  
