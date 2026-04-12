// imports
import express from 'express';

import { initDB } from './db.js';
import personRoutes from './person.js';
import { seedPeople } from './seed.js';

// Initialize the Express application and set up middleware, routes, and database connection.
const app = express();
app.use(express.json());

const PORT = 3002;

// The start function initializes the database, seeds it with initial data, sets up the routes for people, and 
// starts the server to listen for incoming requests.
async function start() {
  // Initialize the database connection by calling the initDB function, which sets up the necessary tables and
  // returns a database instance.
  const db = await initDB();

  // Seed the local read model used by the people service.
  await seedPeople(db);

  // Set up the routes for handling person-related requests, passing the database connection to the route handlers.
  personRoutes(app, db);

  // Start the server and listen on the specified port, logging a message to indicate that the service is running.
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Person service running on ${PORT}`);
  });
}

// Call the start function to initialize the service and begin listening for requests.
start();
