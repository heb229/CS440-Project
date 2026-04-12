// Sample data for movies and critiques
const movies = [
  [1, 'Pulp Fiction'],
  [2, 'Inglourious Basterds'],
  [3, 'Once Upon a Time in Hollywood'],
  [4, 'The Wolf of Wall Street'],
  [5, 'Goodfellas'],
  [6, 'Lady Bird'],
  [7, 'Dune']
];

// Each critique references a movie by its movie_id, and includes a title, author, and content for the critique
const critiques = [
  [1, 'Sharp and unforgettable', 'Alice', 'Pulp Fiction is sharp, funny, and endlessly rewatchable.'],
  [1, 'Iconic dialogue', 'Bob', 'The storytelling is unconventional, but every scene feels memorable.'],
  [2, 'Tense from start to finish', 'Charlie', 'Inglourious Basterds blends suspense and dark humor brilliantly.'],
  [3, 'A bittersweet Hollywood hangout', 'Cara', 'Once Upon a Time in Hollywood feels loose by design, and that makes its ending hit even harder.'],
  [4, 'Wild and excessive', 'Dana', 'The Wolf of Wall Street is chaotic, funny, and intentionally over the top.'],
  [5, 'One of the best crime films ever', 'Evan', 'Goodfellas moves fast and never loses its grip on the characters.'],
  [6, 'Warm and personal', 'Gia', 'Lady Bird is funny, specific, and deeply grounded in its relationships.'],
  [7, 'Huge and immersive', 'Farah', 'Dune feels epic without losing the emotional stakes.']
];

// The seedCritiques function takes a database connection as an argument and populates 
// the movies and movie_critiques tables with the sample data defined above
export async function seedCritiques(db) {
  console.log('Syncing critiques...');

  // Use a transaction to ensure that the seeding process is atomic. 
  // If any error occurs, the transaction will be rolled back to maintain database integrity.
  await db.exec('BEGIN');

  // First, delete existing data from the movie_critiques and movies tables to ensure a clean slate for seeding
  try {
    await db.run('DELETE FROM movie_critiques');
    await db.run('DELETE FROM movies');

    // Insert the sample movies into the movies table
    for (const [id, title] of movies) {
      await db.run(
        'INSERT INTO movies (id, title) VALUES (?, ?)',
        [id, title]
      );
    }

    // Insert the sample critiques into the movie_critiques table, linking each critique to its corresponding movie by movie_id
    for (const [movieId, title, author, content] of critiques) {
      await db.run(
        `INSERT INTO movie_critiques (movie_id, title, author, content)
         VALUES (?, ?, ?, ?)`,
        [movieId, title, author, content]
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
