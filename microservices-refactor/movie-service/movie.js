export default function movieRoutes(app, db) {
  app.get('/movies/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
      // A movie response includes related people so the client can render
      // a complete details page without additional joins.
      const movie = await db.get('SELECT * FROM movies WHERE id = ?', [movieId]);

      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      const cast = await db.all(
        `SELECT p.id, p.name, p.role, p.bio FROM movie_cast mc
         JOIN people p ON mc.person_id = p.id
         WHERE mc.movie_id = ?`,
        [movieId]
      );

      const director = movie.director_id
        ? await db.get('SELECT id, name, role, bio FROM people WHERE id = ?', [movie.director_id])
        : null;

      res.json({
        ...movie,
        director,
        cast
      });
    } 
    catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
