// functions for handling statistics-related routes in the critique service. 
export default function statsRoutes(app, db) {
  app.get('/critiques/stats', async (req, res) => {
    // This route handler retrieves statistics about the critiques in the database, 
    // including the total number of critiques and the number of critiques per movie. 
    try {
      // Get the total number of critiques and the count of critiques grouped by movie_id
      const total = await db.get('SELECT COUNT(*) as count FROM movie_critiques');
      const critiquesPerMovie = await db.all(`
        SELECT movie_id, COUNT(*) as count
        FROM movie_critiques
        GROUP BY movie_id
        ORDER BY movie_id
      `);

      // Return the statistics as a JSON response, including the total count of critiques and the count of critiques per movie
      return res.json({
        total_critiques: total.count,
        critiques_per_movie: critiquesPerMovie
      });
    } 
    // If any error occurs during the database queries, return a 500 error response with the error message
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
}
