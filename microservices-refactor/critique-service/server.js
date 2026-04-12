// imports
import express from 'express';

import { initDB } from './db.js';
import critiquesRoutes from './critiques.js';
import statsRoutes from './stats.js';
import { seedCritiques } from './seed.js';


// Initialize the Express application and set up middleware, routes, and database connection.
const app = express();
app.use(express.json());

// The critique service will run on port 3003
const PORT = 3003;

// The start function initializes the database, seeds it with initial data, sets 
// up the routes for critiques and stats, and starts the server to listen for incoming requests.
async function start() {
  const db = await initDB();

  // Seed critique data and the movie titles those critiques reference.
  await seedCritiques(db);

  // Set up the routes for handling critique-related requests and statistics-related 
  // requests, passing the database connection to each route handler.
  critiquesRoutes(app, db);
  statsRoutes(app, db);

  // Start the server and listen on the specified port, logging a message to indicate that the service is running.
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Critique service running on ${PORT}`);
  });
}

// Call the start function to initialize the service and begin listening for requests.
start();
