#!/bin/zsh

dbs=("hitch_app" "hitch_test")
host="localhost"
port="5432"
username="am"

for db in $dbs; do
    #create db
    dropdb ${db} --if-exists --host=${host} --port=${port} --username=${username} --no-password
    createdb ${db} --host=${host} --port=${port} --username=${username} --no-password

    #create schemas
    psql --dbname=${db} --command='create schema auth'
done

exit
