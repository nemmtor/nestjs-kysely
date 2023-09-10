docker compose -f docker-compose.yml -f docker-compose.ci.yml run --build migrations && docker compose -f docker-compose.yml -f docker-compose.ci.yml down -v --remove-orphans
