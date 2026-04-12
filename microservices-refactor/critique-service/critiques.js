
// Critique service routes
export default function critiquesRoutes(app, db) {
  // Get all critiques, optionally filtered by movie_id
  app.get('/critiques', async (req, res) => {
    const movieId = req.query.movie_id;

    // If movie_id is provided, filter critiques by that movie. Otherwise, return all critiques.
    try {
      // Join critiques with movies to include movie title in the response
      let query = `SELECT c.*, m.title as movie_title
                   FROM movie_critiques c
                   LEFT JOIN movies m ON c.movie_id = m.id`;
      const params = [];

      // If a movie_id query parameter is provided, add a WHERE clause to filter by that movie
      if (movieId) {
        query += ' WHERE c.movie_id = ?';
        params.push(movieId);
      }

      // Order critiques by creation date, newest first
      query += ' ORDER BY c.created_at DESC';

      // Execute the query and return the results
      const critiques = await db.all(query, params);
      return res.json(critiques);
    } 
    // If any error occurs during the database query, return a 500 error response with the error message
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Create a new critique for a movie
  app.get('/movies/:movieId/critiques', async (req, res) => {
    // Get all critiques for a specific movie, identified by movieId in the URL path
    try {
      const critiques = await db.all(
        `SELECT c.*, m.title as movie_title
         FROM movie_critiques c
         LEFT JOIN movies m ON c.movie_id = m.id
         WHERE c.movie_id = ?
         ORDER BY c.created_at DESC`,
        [req.params.movieId]
      );

      return res.json(critiques);
    } 
    // If any error occurs during the database query, return a 500 error response with the error message
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Create a new critique for a movie
  app.post('/critiques', async (req, res) => {
    const { movie_id, title, author, content } = req.body;

    // Validate that all required fields are provided in the request body
    if (!movie_id || !title || !author || !content) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Validate that the movie_id references an existing movie in the database
    try {
      const movie = await db.get('SELECT id, title FROM movies WHERE id = ?', [movie_id]);

      // If no movie is found with the provided movie_id, return a 400 error response indicating that 
      // the critique must reference an existing movie
      if (!movie) {
        return res.status(400).json({ error: 'Critique must reference an existing movie' });
      }

      // Insert the new critique into the database and return the created critique with a 201 status code
      const result = await db.run(
        `INSERT INTO movie_critiques (movie_id, title, author, content)
         VALUES (?, ?, ?, ?)`,
        [movie_id, title, author, content]
      );

      // Return the newly created critique, including the movie title for reference
      return res.status(201).json({
        id: result.lastID,
        movie_id,
        movie_title: movie.title,
        title,
        author,
        content
      });
    } 
    // If any error occurs during the database query, return a 500 error response with the error message
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
}
