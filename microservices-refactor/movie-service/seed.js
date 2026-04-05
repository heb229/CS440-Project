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
  [1, 'Pulp Fiction', 'Crime', 1994, 154, 8.9, 'Crime stories intertwined in LA.', 1],
  [2, 'Inglourious Basterds', 'War', 2009, 153, 8.3, 'A group of soldiers plot against Nazis.', 1],
  [3, 'Once Upon a Time in Hollywood', 'Comedy/Drama', 2019, 161, 7.6, 'A faded actor and his stunt double navigate 1969 LA.', 1],
  [4, 'The Wolf of Wall Street', 'Biography/Comedy', 2013, 180, 8.2, 'Story of stockbroker Jordan Belfort.', 4],
  [5, 'Goodfellas', 'Crime', 1990, 146, 8.7, 'The rise and fall of mob associate Henry Hill.', 4],
  [6, 'Lady Bird', 'Drama', 2017, 94, 7.4, 'A coming-of-age story set in Sacramento.', 7],
  [7, 'Dune', 'Sci-Fi', 2021, 155, 8.1, 'Epic story of politics and betrayal on a desert planet.', 9]
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

export async function seedMovies(db) {
  console.log('Syncing movies and people...');

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

    for (const [id, title, genre, year, runtime, rating, synopsis, directorId] of movies) {
      await db.run(
        `INSERT INTO movies (id, title, genre, year, runtime, rating, synopsis, director_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, title, genre, year, runtime, rating, synopsis, directorId]
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
