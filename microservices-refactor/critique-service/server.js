import express from 'express';
import bodyParser from 'body-parser';

import { initDB } from './db.js';
import critiquesRoutes from './critiques.js';
import statsRoutes from './stats.js';
import { seedCritiques } from './seed.js';

const app = express();
app.use(bodyParser.json());

const PORT = 3003;

async function start() {
  const db = await initDB();

  // Seed critique data and the movie titles those critiques reference.
  await seedCritiques(db);

  critiquesRoutes(app, db);
  statsRoutes(app, db);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Critique service running on ${PORT}`);
  });
}

start();
