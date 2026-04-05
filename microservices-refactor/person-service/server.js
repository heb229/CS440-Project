import express from 'express';
import bodyParser from 'body-parser';

import { initDB } from './db.js';
import personRoutes from './person.js';
import { seedPeople } from './seed.js';

const app = express();
app.use(bodyParser.json());

const PORT = 3002;

async function start() {
  const db = await initDB();
  await seedPeople(db);

  personRoutes(app, db);


  app.listen(PORT, '0.0.0.0', () => {
  console.log(`Person service running on ${PORT}`);
  });
}

start();