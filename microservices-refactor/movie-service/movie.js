// functions to handle movie-related routes and queries
export default function movieRoutes(app, db) {
  // Get all movies, with optional search, sorting, and genre filtering
  app.get('/movies/:id', async (req, res) => {
    const movieId = req.params.id;

    // A movie details response includes the movie information, the director, and the cast members. 
    // This allows the client to render a complete details page without needing to make additional 
    // requests to fetch related people.
    try {
      // A movie response includes related people so the client can render
      // a complete details page without additional joins.
      const movie = await db.get('SELECT * FROM movies WHERE id = ?', [movieId]);

      // If the movie with the specified ID is not found in the database, return a 404 error response with a message 
      // indicating that the movie was not found
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      // Fetch the cast members for the movie by joining the movie_cast table with the people table, and return the cast 
      // information along with the movie details in the response
      const cast = await db.all(
        `SELECT p.id, p.name, p.role, p.bio FROM movie_cast mc
         JOIN people p ON mc.person_id = p.id
         WHERE mc.movie_id = ?`,
        [movieId]
      );

      // Fetch the director information for the movie by looking up the director_id in the movies table and joining it with
      const director = movie.director_id
        ? await db.get('SELECT id, name, role, bio FROM people WHERE id = ?', [movie.director_id]): null;

      // Return the movie details, including the director and cast information, as a JSON response to the client
      res.json({
        ...movie,
        director,
        cast
      });
    } 
    // If any error occurs during the database queries, return a 500 error response with the error message
    catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
