# Properges


## Instalación

1. Clonar el repositorio
2. Crear un .env tomando el .env_example como referencia
3. Construir y ejecutar los contenedores con el comando `make start`
4. Ejecutar `make migrate` para crear la base de datos 
5. Crear el superusuario con comando `make superuser`

Por el momento la base de datos es sqlite3, más adelante se usará postgresql
