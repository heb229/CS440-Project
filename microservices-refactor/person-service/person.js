
// function to set up the routes for the person service, including endpoints to retrieve individual 
// person details and a list of people based on provided IDs. The routes interact with the database 
// to fetch the necessary information about people, their acted movies, and directed movies, and 
// return the results in JSON format.
export default function personRoutes(app, db) {
  // Get details for a specific person by their ID, including the movies they acted in and directed
  app.get('/people/:id', async (req, res) => {
    const personId = req.params.id;

    // The person details response includes the person's information, the movies they acted in, and the movies they directed.
    try {
      // Fetch the person's details from the database using their ID. If the person is not found, return a 404 error response.
      const person = await db.get('SELECT * FROM people WHERE id = ?', [personId]);

      // If the person with the specified ID is not found in the database, return a 404 error response with a 
      // message indicating that the person was not found.
      if (!person) {
        return res.status(404).json({ error: 'Person not found' });
      }

      // Fetch the movies that the person acted in by joining the movie_cast table with the movies table, 
      // and fetch the movies
      const actedMovies = await db.all(
        `SELECT m.id, m.title, m.year, m.genre
         FROM movie_cast mc
         JOIN movies m ON mc.movie_id = m.id
         WHERE mc.person_id = ?
         ORDER BY m.year DESC`,
        [personId]
      );

      // Fetch the movies that the person directed by looking up the director_id in the movies table, 
      // and return the person's details along with the acted movies and directed movies in the response
      const directedMovies = await db.all(
        `SELECT id, title, year, genre
         FROM movies
         WHERE director_id = ?
         ORDER BY year DESC`,
        [personId]
      );

      // Return the person's details, including the movies they acted in and directed, as a JSON response to the client
      return res.json({
        ...person,
        actedMovies,
        directedMovies
      });
    } 
    // If any error occurs during the database queries, return a 500 error response with the error message
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Get a list of people based on provided IDs in the query parameter, allowing clients to fetch multiple 
  // people in a single request
  app.get('/people', async (req, res) => {
    // The route handler retrieves a list of people from the database based on the provided IDs in the query parameter.
    try {
      // Parse the 'ids' query parameter, which is expected to be a comma-separated list of person IDs. 
      // If no valid IDs are provided, return an empty array.
      const personIds = req.query.ids
        ? req.query.ids.split(',').map((value) => value.trim()).filter(Boolean): [];

      // If no valid person IDs are provided, return an empty array as the response to indicate that no people were found.
      if (personIds.length === 0) {
        return res.json([]);
      }

      // Construct a SQL query to fetch the details of the people with the specified IDs. The query uses placeholders
      const placeholders = personIds.map(() => '?').join(',');
      const people = await db.all(`SELECT * FROM people WHERE id IN (${placeholders})`, personIds);

      // Return the list of people as a JSON response to the client.
      return res.json(people);
    } 
    // if any error occurs during the database query, return a 500 error response with the error message
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
}
