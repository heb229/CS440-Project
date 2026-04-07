import express from 'express';
import bodyParser from 'body-parser';

import { initDB } from './db.js';
import moviesRoutes from './movies.js';
import movieRoutes from './movie.js';
import { seedMovies } from './seed.js';

const app = express();
app.use(bodyParser.json());

const PORT = 3001;

async function start() {
  const db = await initDB();

  // Seed the local service cache so the microservice can run independently.
  await seedMovies(db);

  moviesRoutes(app, db);
  movieRoutes(app, db);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Movie service running on ${PORT}`);
  });
}

start();
