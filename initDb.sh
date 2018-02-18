#!/bin/zsh

dbs=($PG_DATABASE)
host=$PG_HOST
port=$PG_PORT
username=$PG_USERNAME

for db in $dbs; do
    #create db
    dropdb ${db} --if-exists --host=${host} --port=${port} --username=${username} --no-password
    createdb ${db} --host=${host} --port=${port} --username=${username} --no-password

    #create schemas
    psql --host=${host} --port=${port} --username=${username} --dbname=${db} --command='create schema auth'
done

exit
