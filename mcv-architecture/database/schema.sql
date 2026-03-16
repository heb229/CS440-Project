-- Clean the tables if they already exist
DROP TABLE IF EXISTS movie_critiques;
DROP TABLE IF EXISTS movie_cast;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS people;

-- Create the people table
CREATE TABLE people (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    birth_year INTEGER
);

-- Create the movie table
CREATE TABLE movies (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER,
    genre TEXT,
    description TEXT,
    director_id INTEGER,
    FOREIGN KEY (director_id) REFERENCES people(id)
);

-- Create the cast table
CREATE TABLE movie_cast (
    movie_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL,
    PRIMARY KEY (movie_id, person_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (person_id) REFERENCES people(id)
);

-- Create the critique table
CREATE TABLE movie_critiques (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);