// imports
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize the SQLite database connection and create tables if they don't exist
export async function initDB() {
  const db = await open({
    filename: './movies.db',
    driver: sqlite3.Database
  });

  // Enable foreign key constraints to ensure that movie cast members reference valid 
  // people and are deleted if the referenced person is deleted
  await db.exec('PRAGMA foreign_keys = ON');

  // Create tables if they don't exist, including the people table for actors and directors, the movies table for movie 
  // details, and the movie_cast table to represent the many-to-many relationship between movies and people
  await db.exec(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      bio TEXT
    );

    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      genre TEXT,
      year INTEGER,
      runtime INTEGER,
      rating REAL,
      synopsis TEXT,
      director_id INTEGER,
      FOREIGN KEY (director_id) REFERENCES people(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS movie_cast (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      person_id INTEGER NOT NULL,
      UNIQUE(movie_id, person_id),
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
      FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
    );
  `);

  // Return the database connection object to be used for executing queries in other parts of the application
  return db;
}
