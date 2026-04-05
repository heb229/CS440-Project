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

const movies = [
  [1, 'Pulp Fiction', 1994, 'Crime', 154, 8.9, 1],
  [2, 'Inglourious Basterds', 2009, 'War', 153, 8.3, 1],
  [3, 'Once Upon a Time in Hollywood', 2019, 'Comedy/Drama', 161, 7.6, 1],
  [4, 'The Wolf of Wall Street', 2013, 'Biography/Comedy', 180, 8.2, 4],
  [5, 'Goodfellas', 1990, 'Crime', 146, 8.7, 4],
  [6, 'Lady Bird', 2017, 'Drama', 94, 7.4, 7],
  [7, 'Dune', 2021, 'Sci-Fi', 155, 8.1, 9]
];

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

export async function seedPeople(db) {
  console.log('Syncing people cache...');

  await db.exec('BEGIN');

  try {
    await db.run('DELETE FROM movie_cast');
    await db.run('DELETE FROM movies');
    await db.run('DELETE FROM people');

    for (const [id, name, role, bio] of people) {
      await db.run(
        'INSERT INTO people (id, name, role, bio) VALUES (?, ?, ?, ?)',
        [id, name, role, bio]
      );
    }

    for (const [id, title, year, genre, runtime, rating, directorId] of movies) {
      await db.run(
        `INSERT INTO movies (id, title, year, genre, runtime, rating, director_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, title, year, genre, runtime, rating, directorId]
      );
    }

    for (const [movieId, personId] of cast) {
      await db.run(
        'INSERT INTO movie_cast (movie_id, person_id) VALUES (?, ?)',
        [movieId, personId]
      );
    }

    await db.exec('COMMIT');
  } catch (err) {
    await db.exec('ROLLBACK');
    throw err;
  }
}
