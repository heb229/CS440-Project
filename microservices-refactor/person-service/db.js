//imports
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Initialize the SQLite database connection and create tables if they don't exist
export async function initDB() {
  // Open a connection to the SQLite database file named 'people.db' using the sqlite3 driver
  const db = await open({
    filename: "./people.db",
    driver: sqlite3.Database,
  });

  // Enable foreign key constraints to ensure that movie cast members reference valid
  await db.exec("PRAGMA foreign_keys = ON");

  // Create tables if they don't exist, including the people table for actors and directors, the movies table for movie details,
  // and the movie_cast table to represent the many-to-many relationship between movies and people.
  // The people table includes columns for id, name, role, and bio. The movies table includes columns for id, title,
  // year, genre, runtime, rating, synopsis, and director_id. The movie_cast table includes columns for id, movie_id,
  // person_id, and foreign key constraints to ensure referential integrity.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      bio TEXT
    );
  `);

  return db;
}
