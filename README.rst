Search Engine con PSQL-nodejs-redis
=======================================

Proyecto para un navegador haciendo uso de clusterRedis para el caché, nodeJS para cliente/backend y base de datos PSQL.
Sebastian Arroyo / Matias Gastellu
https://docs.readthedocs.io/en/stable/tutorial/


Instrucciones 
    
    Iniciar PSQL
Se utiliza el comando
sudo docker run --name postgresql -p 5432:5432 -e
POSTGRESQL_USERNAME=my_user -e POSTGRESQL_PASSWORD=password123 -e
POSTGRESQL_DATABASE=my_database -v /home/esgaroth/databasePsql:/bitnami/postgresql
bitnami/postgresql:latest
