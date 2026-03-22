import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

async function seedDatabase() {
  try {
    console.log("Starting database seed...");

    // create/reset tables from schema.sql
    await db.query(schema);

    // seed people
    await db.query(`
      INSERT INTO people (id, name, role, bio, birth_year) VALUES
      (1, 'Christopher Nolan', 'Director', 'Known for cerebral films.', 1970),
      (2, 'Leonardo DiCaprio', 'Actor', 'Award-winning actor.', 1974),
      (3, 'Joseph Gordon-Levitt', 'Actor', 'American actor and filmmaker.', 1981),
      (4, 'Greta Gerwig', 'Director', 'Director and writer.', 1983),
      (5, 'Margot Robbie', 'Actor', 'Australian actress and producer.', 1990);
    `);

    // seed movies
    await db.query(`
      INSERT INTO movies (id, title, year, genre, description, director_id) VALUES
      (1, 'Inception', 2010, 'Sci-Fi, Thriller', 'A thief enters dreams to steal secrets.', 1),
      (2, 'Barbie', 2023, 'Comedy, Fantasy', 'Barbie explores the real world.', 4);
    `);

    // seed cast
    await db.query(`
      INSERT INTO movie_cast (movie_id, person_id) VALUES
      (1, 2),
      (1, 3),
      (2, 5);
    `);

    // seed critiques
    await db.query(`
      INSERT INTO movie_critiques (movie_id, title, author, content) VALUES
      (1, 'Great movie', 'Alex', 'Really smart and visually impressive.'),
      (2, 'Surprisingly thoughtful', 'Jamie', 'Much deeper than I expected.');
    `);

    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Seeding error:", err.message);
  } finally {
    await db.end();
  }
}

seedDatabase();