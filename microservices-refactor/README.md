# Microservices Refactor

This folder contains a small movie catalog application refactored into multiple microservices. The project includes a Docker-based backend and a static frontend.

## Technologies

- Node.js
- Express
- SQLite
- `sqlite3`
- `sqlite`
- `cors`
- `http-proxy-middleware`
- Docker
- Docker Compose
- `npx serve` for the static frontend
- HTML, CSS, and JavaScript

## Services

- `api-gateway`
  Routes frontend requests to the backend services and exposes the combined movie details endpoint.
- `movie-service`
  Owns movie, director, and cast data.
- `person-service`
  Owns people data and the movie relationships needed for actor/director pages.
- `critique-service`
  Owns critiques and critique statistics.
- `frontend`
  Static client pages for browsing movies, people, and critiques.

## File Structure

```text
microservices-refactor/
|-- api-gateway/
|   |-- Dockerfile
|   |-- package.json
|   `-- server.js
|-- critique-service/
|   |-- critiques.js
|   |-- db.js
|   |-- Dockerfile
|   |-- package.json
|   |-- seed.js
|   |-- server.js
|   `-- stats.js
|-- frontend/
|   |-- index.html
|   |-- movie.html
|   |-- movie_critiques.html
|   |-- person.html
|   `-- script.js
|-- movie-service/
|   |-- db.js
|   |-- Dockerfile
|   |-- movie.js
|   |-- movies.js
|   |-- package.json
|   |-- seed.js
|   `-- server.js
|-- person-service/
|   |-- db.js
|   |-- Dockerfile
|   |-- package.json
|   |-- person.js
|   |-- seed.js
|   `-- server.js
|-- docker-compose.yml
`-- README.md
```

## Main API Endpoints

### Gateway

- `GET /movies`
- `GET /movies/:id`
- `GET /movies/:id/details`
- `GET /people/:id`
- `GET /critiques`
- `POST /critiques`

### Critique Service

- `GET /critiques`
- `GET /movies/:movieId/critiques`
- `POST /critiques`
- `GET /critiques/stats`

## How to Run

### 1. Start Docker Desktop

Make sure Docker Desktop is open and fully running before starting the containers. What I mean, is to open the app.

### 2. Start the backend

From inside `microservices-refactor` (the same folder that this readme is in):

```powershell
docker compose up --build
```

This starts:

- API Gateway on `http://localhost:3000`
- Movie Service on `http://localhost:3001`
- Person Service on `http://localhost:3002`
- Critique Service on `http://localhost:3003`

You should see something like this:

![Docker Build](microservices-refactor/readme-images/buildup.png)

### 3. Start the frontend

Open a second terminal (still in the microservices-refactor folder) and run:

```powershell
cd frontend
npx serve .
```

`serve` will print the frontend URL in the terminal. Copy the local host link into your browser to access the locally hosted website. You should see something like:

![Website Served](microservices-refactor/readme-images/serve.png)

### 4. Open the app

Open the frontend URL from the `npx serve` output in your browser. Because we have seed files, everything should be working from the start and you don't need to add stuff to the inital database. This was done to make things easier to start up and test.

The homepage you see should look like:

![Homepage](microservices-refactor/readme-images/webhomepage.png)

## Reset the Seeded Databases

If Docker volumes contain old data and you want a clean reset:

```powershell
docker compose down -v
docker compose up --build
```

## Notes

- Each service seeds its own local SQLite database on startup.
- The gateway provides the combined movie details endpoint so the frontend does not have to join data manually.
- The frontend is intentionally simple and uses normal JavaScript instead of a framework to keep with project consistency for the class.
