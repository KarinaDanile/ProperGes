-include .env

start:
	docker compose up -d

build:
	docker compose build

stop:
	docker compose down

migrate:
	docker exec -it backend-container python manage.py makemigrations
	docker exec -it backend-container python manage.py migrate

terminal-front:
	docker exec -it frontend-container /bin/bash

terminal-back:
	docker exec -it backend-container /bin/bash

remove:
	docker compose down -v --rmi all

removeimages:
	docker rmi ${APP_NAME}-frontend ${APP_NAME}-backend