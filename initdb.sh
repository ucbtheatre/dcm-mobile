#!/bin/sh
# Script to load the database into a local MySQL server

DBNAME=dcm
DBUSER=root

echo Loading local database $DBNAME as user $DBUSER
(
	echo "DROP DATABASE IF EXISTS \`$DBNAME\`;";
	echo "CREATE DATABASE \`$DBNAME\`;";
	echo "USE \`$DBNAME\`;";
	gzcat dcm13_scrubbed.sql.gz
) | mysql --user=$DBUSER --password
