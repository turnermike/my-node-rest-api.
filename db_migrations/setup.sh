##
# Run this script to setup the default database tables.
#
#
##

mongoimport --db my-node-rest-api --collection roles --jsonArray --file roles.json