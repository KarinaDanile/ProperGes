# Properges


## Instalación

1. Clonar el repositorio
2. Crear un .env y un env.local tomando los .env_example como referencia
3. Construir y ejecutar los contenedores con el comando `make start`
4. Ejecutar `make migrate` para crear la base de datos 
5. Habrá un usuario creado, "admin" con contraseña "admin"

Para local se usa sqlite3 y en despliegue, postgreSQL
