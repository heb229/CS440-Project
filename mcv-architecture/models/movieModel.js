import db from './db.js';

class MovieModel
{
    // Get all movies, with optional filtering and sorting.
    static getAll(filters = {})
    {
        return new Promise((resolve, reject) =>
        {
            const search = filters.search;
            const genre = filters.genre;
            const sort = filters.sort || 'title';
            const order = filters.order || 'ASC';
            const year = filters.year;

            let sql = 'SELECT * FROM movies WHERE 1 = 1';
            const params = [];

            // Filter by movie title if a search value was provided.
            if (search)
            {
                sql += ' AND title LIKE ?';
                params.push(`%${search}%`);
            }

            // Filter by genre if one was provided.
            if (genre)
            {
                sql += ' AND genre LIKE ?';
                params.push(`%${genre}%`);
            }

            // Filter by exact year if one was provided.
            if (year)
            {
                sql += ' AND year = ?';
                params.push(Number(year));
            }

            // Only allow safe column names for sorting.
            const allowedSortColumns = ['title', 'year', 'genre'];
            const safeSortColumn = allowedSortColumns.includes(sort) ? sort : 'title';

            // Only allow ASC or DESC for ordering.
            const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

            sql += ` ORDER BY ${safeSortColumn} ${safeOrder}`;

            db.all(sql, params, (error, rows) =>
            {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    resolve(rows);
                }
            });
        });
    }

    // Get one movie by its ID, including director and cast.
    static getById(id)
    {
        return new Promise((resolve, reject) =>
        {
            db.get(
                'SELECT * FROM movies WHERE id = ?',
                [id],
                (movieError, movie) =>
                {
                    if (movieError)
                    {
                        return reject(movieError);
                    }

                    if (!movie)
                    {
                        return resolve(null);
                    }

                    // Load the director record for this movie.
                    db.get(
                        'SELECT * FROM people WHERE id = ?',
                        [movie.director_id],
                        (directorError, director) =>
                        {
                            if (directorError)
                            {
                                return reject(directorError);
                            }

                            // Load all cast members connected to this movie.
                            db.all(
                                `
                                SELECT p.*
                                FROM movie_cast mc
                                JOIN people p ON mc.person_id = p.id
                                WHERE mc.movie_id = ?
                                `,
                                [id],
                                (castError, cast) =>
                                {
                                    if (castError)
                                    {
                                        return reject(castError);
                                    }

                                    resolve(
                                    {
                                        ...movie,
                                        director: director,
                                        cast: cast
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

export default MovieModel;