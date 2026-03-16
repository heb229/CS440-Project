import db from './db.js';

class CritiqueModel
{
    // Get all critiques, or only critiques for one movie if a movie ID is provided.
    static getAll(movieId = null)
    {
        return new Promise((resolve, reject) =>
        {
            let sql = `
                SELECT mc.*, m.title AS movie_title
                FROM movie_critiques mc
                JOIN movies m ON mc.movie_id = m.id
            `;

            const params = [];

            // If a movie ID was passed in, only return critiques for that movie.
            if (movieId)
            {
                sql += ' WHERE mc.movie_id = ?';
                params.push(movieId);
            }

            sql += ' ORDER BY mc.created_at DESC';

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

    // Insert a new critique into the database.
    static create(critiqueData)
    {
        return new Promise((resolve, reject) =>
        {
            const movieId = critiqueData.movie_id;
            const title = critiqueData.title;
            const author = critiqueData.author;
            const content = critiqueData.content;

            db.run(
                `
                INSERT INTO movie_critiques (movie_id, title, author, content)
                VALUES (?, ?, ?, ?)
                `,
                [movieId, title, author, content],
                function (error)
                {
                    if (error)
                    {
                        reject(error);
                    }
                    else
                    {
                        resolve(
                        {
                            id: this.lastID
                        });
                    }
                }
            );
        });
    }
}

export default CritiqueModel;