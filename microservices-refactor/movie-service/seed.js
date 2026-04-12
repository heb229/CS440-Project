// const for people, movies, and cast data to be seeded into the database. Each entry in the people array 
// contains an id, name, role (director or actor), and a brief bio. Each entry in the movies array
//  contains an id, title, genre, release year, runtime, rating, synopsis, and director_id that references 
// the director of the movie. The cast array contains pairs of movie_id and person_id to establish the relationship 
// between movies and their cast members.

// people seed
const people = [
  [1, 'Quentin Tarantino', 'director', 'Known for stylized violence and nonlinear storylines'],
  [2, 'Brad Pitt', 'actor', 'Academy Award-winning actor'],
  [3, 'Samuel L. Jackson', 'actor', 'Prolific actor with over 150 film credits'],
  [4, 'Martin Scorsese', 'director', 'Legendary director of crime films'],
  [5, 'Robert De Niro', 'actor', 'Famous for roles in crime and drama films'],
  [6, 'Emma Stone', 'actor', 'Oscar-winning actress'],
  [7, 'Greta Gerwig', 'director', 'Director known for modern coming-of-age films'],
  [8, 'Timothee Chalamet', 'actor', 'Young actor with critical acclaim'],
  [9, 'Christopher Nolan', 'director', 'Known for complex narratives']
];

// movies seed
const movies = [
  [1, 'Pulp Fiction', 'Crime', 1994, 154, 8.9, 'Crime stories intertwined in LA.', 1],
  [2, 'Inglourious Basterds', 'War', 2009, 153, 8.3, 'A group of soldiers plot against Nazis.', 1],
  [3, 'Once Upon a Time in Hollywood', 'Comedy/Drama', 2019, 161, 7.6, 'A faded actor and his stunt double navigate 1969 LA.', 1],
  [4, 'The Wolf of Wall Street', 'Biography/Comedy', 2013, 180, 8.2, 'Story of stockbroker Jordan Belfort.', 4],
  [5, 'Goodfellas', 'Crime', 1990, 146, 8.7, 'The rise and fall of mob associate Henry Hill.', 4],
  [6, 'Lady Bird', 'Drama', 2017, 94, 7.4, 'A coming-of-age story set in Sacramento.', 7],
  [7, 'Dune', 'Sci-Fi', 2021, 155, 8.1, 'Epic story of politics and betrayal on a desert planet.', 9]
];

// cast seed 
const cast = [
  [1, 3],
  [1, 2],
  [2, 3],
  [2, 2],
  [3, 2],
  [3, 8],
  [4, 5],
  [4, 8],
  [5, 5],
  [5, 3],
  [6, 6],
  [7, 8]
];

// The seedMovies function takes a database connection as an argument and populates the people, movies, and 
// movie_cast tables with the sample data defined above.
export async function seedMovies(db) {
  console.log('Syncing movies and people...');

  // Use a transaction to ensure that the seeding process is atomic. If any error occurs, the 
  // transaction will be rolled back to maintain database integrity.
  await db.exec('BEGIN');

  // First, delete existing data from the movie_cast, movies, and people tables to ensure a clean slate for seeding
  try {
    await db.run('DELETE FROM movie_cast');
    await db.run('DELETE FROM movies');
    await db.run('DELETE FROM people');

    // Insert the sample people into the people table, including directors and actors with their respective roles and bios
    for (const [id, name, role, bio] of people) {
      await db.run(
        'INSERT INTO people (id, name, role, bio) VALUES (?, ?, ?, ?)',
        [id, name, role, bio]
      );
    }

    // Insert the sample movies into the movies table, including details such as title, genre, release year, 
    // runtime, rating, synopsis, and director_id
    for (const [id, title, genre, year, runtime, rating, synopsis, directorId] of movies) {
      await db.run(
        `INSERT INTO movies (id, title, genre, year, runtime, rating, synopsis, director_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, title, genre, year, runtime, rating, synopsis, directorId]
      );
    }

    // Insert the sample cast relationships into the movie_cast table, linking movies to their 
    // respective cast members by movie_id and person_id
    for (const [movieId, personId] of cast) {
      await db.run(
        'INSERT INTO movie_cast (movie_id, person_id) VALUES (?, ?)',
        [movieId, personId]
      );
    }

    // If all inserts are successful, commit the transaction to save the changes to the database
    await db.exec('COMMIT');
  } 
  // If any error occurs during the seeding process, roll back the transaction to undo any changes and maintain database integrity
  catch (err) {
    await db.exec('ROLLBACK');
    throw err;
  }
}
