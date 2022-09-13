Template for the Read the Docs tutorial
=======================================

This GitHub template includes fictional Python library
with some basic Sphinx docs.

Read the tutorial here:

https://docs.readthedocs.io/en/stable/tutorial/


>> sudo chmod o+w databasePsql

>>sudo docker run --name postgresql -e POSTGRESQL_USERNAME=my_user -e POSTGRESQL_PASSWORD=password123 -e \\
 POSTGRESQL_DATABASE=my_database -v /home/esgaroth/databasePsql:/bitnami/postgresql bitnami/postgresql:latest

>>sudo docker exec "container ID" -i bash
>>psql -U my_user -d my_database
>>password123