# Makefile

# 기본 환경
DC=docker-compose
DC_DEV=docker-compose -f docker-compose.yml -f docker-compose.override.yml

.PHONY: dev prod down clean

# 개발용: volumn mount + bootRun
dev:
	$(DC_DEV) up --build

# 운영용: JAR 빌드 포함
prod:
	$(DC) up --build -d

# 종료
down:
	$(DC_DEV) down

# 컨테이너/볼륨 정리
clean:
	$(DC) down -v --rmi all --remove-orphans
