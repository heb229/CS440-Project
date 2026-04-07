function registerPersonDetailsRoute(app, db, path) {
  app.get(path, async (req, res) => {
    const personId = req.params.id;

    try {
      const person = await db.get('SELECT * FROM people WHERE id = ?', [personId]);

      if (!person) {
        return res.status(404).json({ error: 'Person not found' });
      }

      const actedMovies = await db.all(
        `SELECT m.id, m.title, m.year, m.genre FROM movie_cast mc
         JOIN movies m ON mc.movie_id = m.id
         WHERE mc.person_id = ?
         ORDER BY m.year DESC`,
        [personId]
      );

      const directedMovies = await db.all(
        'SELECT id, title, year, genre FROM movies WHERE director_id = ? ORDER BY year DESC',
        [personId]
      );

      return res.json({
        ...person,
        actedMovies,
        directedMovies
      });
    } 
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
}

export default function personRoutes(app, db) {
  // Preferred RESTful endpoint.
  registerPersonDetailsRoute(app, db, '/people/:id');

  // Legacy alias preserved so older links still resolve.
  registerPersonDetailsRoute(app, db, '/person/:id');

  app.get('/people', async (req, res) => {
    try {
      const personIds = req.query.ids
        ? req.query.ids.split(',').map((value) => value.trim()).filter(Boolean)
        : [];

      if (personIds.length === 0) {
        return res.json([]);
      }

      const placeholders = personIds.map(() => '?').join(',');
      const people = await db.all(`SELECT * FROM people WHERE id IN (${placeholders})`, personIds);

      return res.json(people);
    } 
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
}
