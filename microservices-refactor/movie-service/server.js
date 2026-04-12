// imports
import express from 'express';

import { initDB } from './db.js';
import moviesRoutes from './movies.js';
import movieRoutes from './movie.js';
import { seedMovies } from './seed.js';

// Initialize the Express application and set up middleware, routes, and database connection.
const app = express();
app.use(express.json());

const PORT = 3001;

// The start function initializes the database, seeds it with initial data, sets up the routes for movies and individual 
// movie details, and starts the server to listen for incoming requests.
async function start() {
  const db = await initDB();

  // Seed the local service cache so the microservice can run independently.
  await seedMovies(db);

  moviesRoutes(app, db);
  movieRoutes(app, db);

  // Start the server and listen on the specified port, logging a message to indicate that the service is running.
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Movie service running on ${PORT}`);
  });
}

start();
