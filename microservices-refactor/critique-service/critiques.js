export default function critiquesRoutes(app, db) {
  app.get('/critiques', async (req, res) => {
    const movieId = req.query.movie_id;

    try {
      let query = `SELECT c.*, m.title as movie_title FROM movie_critiques c
                   LEFT JOIN movies m ON c.movie_id = m.id`;
      const params = [];

      if (movieId) {
        query += ' WHERE c.movie_id = ?';
        params.push(movieId);
      }

      query += ' ORDER BY c.created_at DESC';

      const critiques = await db.all(query, params);
      return res.json(critiques);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Critiques belong to a movie, so this subresource path is the primary RESTful route.
  app.get('/movies/:movieId/critiques', async (req, res) => {
    try {
      const critiques = await db.all(
        `SELECT c.*, m.title as movie_title FROM movie_critiques c
         LEFT JOIN movies m ON c.movie_id = m.id
         WHERE c.movie_id = ? ORDER BY c.created_at DESC`,
        [req.params.movieId]
      );

      return res.json(critiques);
    } 
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Legacy alias preserved for compatibility with older gateway code.
  app.get('/critiques/movie/:movieId', async (req, res) => {
    try {
      const critiques = await db.all(
        `SELECT c.*, m.title as movie_title FROM movie_critiques c
         LEFT JOIN movies m ON c.movie_id = m.id
         WHERE c.movie_id = ? ORDER BY c.created_at DESC`,
        [req.params.movieId]
      );

      return res.json(critiques);
    } 
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/critiques', async (req, res) => {
    const { movie_id, title, author, content } = req.body;

    if (!movie_id || !title || !author || !content) {
      return res.status(400).json({ error: 'All fields required' });
    }

    try {
      const movie = await db.get('SELECT id, title FROM movies WHERE id = ?', [movie_id]);

      if (!movie) {
        return res.status(400).json({ error: 'Critique must reference an existing movie' });
      }

      const result = await db.run(
        `INSERT INTO movie_critiques (movie_id, title, author, content)
         VALUES (?, ?, ?, ?)`,
        [movie_id, title, author, content]
      );

      return res.status(201).json({
        id: result.lastID,
        movie_id,
        movie_title: movie.title,
        title,
        author,
        content
      });
    } 
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
}
