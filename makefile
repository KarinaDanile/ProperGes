start:
	docker-compose up -d

build:
	docker-compose build

stop:
	docker-compose down -v

terminal-front:
	docker exec -it frontend-container bash

terminal-back:
	docker exec -it backend-container bash