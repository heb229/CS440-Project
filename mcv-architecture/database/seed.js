// Set imports
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Assign verbose
sqlite3.verbose();

// Set constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'movies.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new sqlite3.Database(dbPath);

const schema = fs.readFileSync(schemaPath, 'utf-8');

// Add in the inital database info (seed the database)
db.serialize(() => {
  db.exec(schema);

  db.run(`
    INSERT INTO people (id, name, role, bio, birth_year) VALUES
    (1, 'Christopher Nolan', 'Director', 'Known for cerebral films.', 1970),
    (2, 'Leonardo DiCaprio', 'Actor', 'Award-winning actor.', 1974),
    (3, 'Joseph Gordon-Levitt', 'Actor', 'American actor and filmmaker.', 1981),
    (4, 'Greta Gerwig', 'Director', 'Director and writer.', 1983),
    (5, 'Margot Robbie', 'Actor', 'Australian actress and producer.', 1990)
  `);

  db.run(`
    INSERT INTO movies (id, title, year, genre, description, director_id) VALUES
    (1, 'Inception', 2010, 'Sci-Fi, Thriller', 'A thief enters dreams to steal secrets.', 1),
    (2, 'Barbie', 2023, 'Comedy, Fantasy', 'Barbie explores the real world.', 4)
  `);

  db.run(`
    INSERT INTO movie_cast (movie_id, person_id) VALUES
    (1, 2),
    (1, 3),
    (2, 5)
  `);

  db.run(`
    INSERT INTO movie_critiques (movie_id, title, author, content) VALUES
    (1, 'Great movie', 'Alex', 'Really smart and visually impressive.'),
    (2, 'Surprisingly thoughtful', 'Jamie', 'Much deeper than I expected.')
  `);
});

// Then, when done, close the database
db.close(() => {
  console.log('Database seeded successfully.');
});