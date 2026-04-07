function registerStatsRoute(app, db, path) {
  app.get(path, async (req, res) => {
    try {
      const total = await db.get('SELECT COUNT(*) as count FROM movie_critiques');
      const critiquesPerMovie = await db.all(`
        SELECT movie_id, COUNT(*) as count
        FROM movie_critiques
        GROUP BY movie_id
        ORDER BY movie_id
      `);

      return res.json({
        total_critiques: total.count,
        critiques_per_movie: critiquesPerMovie
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
}

export default function statsRoutes(app, db) {
  // RESTful version scoped under the critique collection.
  registerStatsRoute(app, db, '/critiques/stats');

  // Legacy alias preserved for older versions (will remove this weekend)
  registerStatsRoute(app, db, '/stats');
}
