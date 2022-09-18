Search Engine con PSQL-nodejs-redis
=======================================

Proyecto para un navegador haciendo uso de clusterRedis para el caché, nodeJS para cliente/backend y base de datos PSQL.
Sebastian Arroyo / Matias Gastellu
https://docs.readthedocs.io/en/stable/tutorial/


Instrucciones 

    ```bash
    sudo chmod o+w databasePsql
    sudo docker run --name postgresql -e POSTGRESQL_USERNAME=my_user -e POSTGRESQL_PASSWORD=password123 -e POSTGRESQL_DATABASE=my_database -v        
    /home/esgaroth/databasePsql:/bitnami/postgresql bitnami/postgresql:latest
    sudo docker exec -ti  container ID  bash
    psql -U my_user -d my_database
    password123
    ```
