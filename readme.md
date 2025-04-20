# Course Catalog Platform


A containerized full-stack web application for managing and browsing courses. Built with React (frontend), PHP (backend), MySQL (database), and Traefik (reverse proxy) using Docker Compose for seamless local development.

🔧 Tech Stack
Frontend: React + Vite

Backend: PHP (Laravel-ready)

Database: MySQL 8

Proxy: Traefik 2

Dev Environment: Docker & Docker Compose
## How to run project:

```
docker-compose up --build
```

## Hosts:
API host: http://api.cc.localhost

DB host: http://db.cc.localhost

Front host: http://cc.localhost

Traefik dashboard: http://127.0.0.1:8080/dashboard/#/

N.B.: Please allow some time for the backend to fully build and connect to the database before fetching data from database.

