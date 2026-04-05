export default function statsRoutes(app, db) {

  app.get('/stats', async (req, res) => {
    try {
      const total = await db.get('SELECT COUNT(*) as count FROM movie_critiques');
      const avgPerMovie = await db.all(`
        SELECT movie_id, COUNT(*) as count
        FROM movie_critiques
        GROUP BY movie_id
        ORDER BY movie_id
      `);

      res.json({
        total_critiques: total.count,
        critiques_per_movie: avgPerMovie
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

}
