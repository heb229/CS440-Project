const movies = [
  [1, 'Pulp Fiction'],
  [2, 'Inglourious Basterds'],
  [3, 'Once Upon a Time in Hollywood'],
  [4, 'The Wolf of Wall Street'],
  [5, 'Goodfellas'],
  [6, 'Lady Bird'],
  [7, 'Dune']
];

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

export async function seedCritiques(db) {
  console.log('Syncing critiques...');

  await db.exec('BEGIN');

  try {
    await db.run('DELETE FROM movie_critiques');
    await db.run('DELETE FROM movies');

    for (const [id, title] of movies) {
      await db.run(
        'INSERT INTO movies (id, title) VALUES (?, ?)',
        [id, title]
      );
    }

    for (const [movieId, title, author, content] of critiques) {
      await db.run(
        `INSERT INTO movie_critiques (movie_id, title, author, content)
         VALUES (?, ?, ?, ?)`,
        [movieId, title, author, content]
      );
    }

    await db.exec('COMMIT');
  } catch (err) {
    await db.exec('ROLLBACK');
    throw err;
  }
}
