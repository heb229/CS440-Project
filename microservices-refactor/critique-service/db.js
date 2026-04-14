// imports
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Initialize the SQLite database connection and create tables if they don't exist
export async function initDB() {
  const db = await open({
    filename: "./critiques.db",
    driver: sqlite3.Database,
  });

  // Enable foreign key constraints to ensure that critiques reference valid movies
  // and are deleted if the referenced movie is deleted
  await db.exec("PRAGMA foreign_keys = ON");

  // Create table if not exists
  await db.exec(`

    CREATE TABLE IF NOT EXISTS movie_critiques (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
    );
  `);

  // return
  return db;
}
