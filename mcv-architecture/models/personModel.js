import db from './db.js';

class PersonModel
{
    // Get one person by ID, along with acted and directed movies.
    static getById(id)
    {
        return new Promise((resolve, reject) =>
        {
            db.get(
                'SELECT * FROM people WHERE id = ?',
                [id],
                (personError, person) =>
                {
                    if (personError)
                    {
                        return reject(personError);
                    }

                    if (!person)
                    {
                        return resolve(null);
                    }

                    // Get movies where this person appears in the cast.
                    db.all(
                        `
                        SELECT m.*
                        FROM movie_cast mc
                        JOIN movies m ON mc.movie_id = m.id
                        WHERE mc.person_id = ?
                        `,
                        [id],
                        (actedMoviesError, actedMovies) =>
                        {
                            if (actedMoviesError)
                            {
                                return reject(actedMoviesError);
                            }

                            // Get movies directed by this person.
                            db.all(
                                'SELECT * FROM movies WHERE director_id = ?',
                                [id],
                                (directedMoviesError, directedMovies) =>
                                {
                                    if (directedMoviesError)
                                    {
                                        return reject(directedMoviesError);
                                    }

                                    resolve(
                                    {
                                        ...person,
                                        actedMovies: actedMovies,
                                        directedMovies: directedMovies
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
    }
}

export default PersonModel;