// functions to handle movie-related routes and queries
export default function moviesRoutes(app, db) {
  // Get all movies, with optional search, sorting, and genre filtering
  app.get('/movies', async (req, res) => {
    const {
      search,
      genre,
      mode = 'or',
      sort = 'title',
      order = 'asc',
      year,
      decade
    } = req.query;

    // Build the query incrementally so each optional filter stays easy to follow.
    try {
      // Start with a base query that selects all movies, and then add conditions based on the presence of search, 
      // genre, year, and decade filters in the query parameters.
      let query = 'SELECT * FROM movies WHERE 1=1';
      const params = [];

      // If a search term is provided, add a condition to filter movies where the title contains the search term
      if (search) {
        query += ' AND title LIKE ?';
        params.push(`%${search}%`);
      }

      // If a genre filter is provided, split the genre string into an array of selected genres, and add conditions to 
      // filter movies based on the selected genres and the specified mode (OR or AND)
      if (genre) {
        // Split the genre string into an array of selected genres, trimming any whitespace from each genre value
        const selectedGenres = genre.split(',').map((value) => value.trim());

        // If the mode is 'or', add a condition that matches movies where the genre contains any of the selected genres.
        if (mode === 'or') {
          // Construct a condition that checks if the genre column contains any of the selected genres using the LIKE operator, 
          // and join the conditions with OR
          const genreConditions = selectedGenres.map(() => 'genre LIKE ?').join(' OR ');
          query += ` AND (${genreConditions})`;
          selectedGenres.forEach((selectedGenre) => {
            params.push(`%${selectedGenre}%`);
          });
        } 
        // If the mode is 'and', add conditions that match movies where the genre contains all of the selected genres. 
        // This is done by adding a separate condition for each selected genre and joining them with AND, ensuring 
        // that only movies that match
        else {
          selectedGenres.forEach((selectedGenre) => {
            query += ' AND genre LIKE ?';
            params.push(`%${selectedGenre}%`);
          });
        }
      }

      // If a year filter is provided, add a condition to filter movies released in that specific year
      if (year) {
        query += ' AND year = ?';
        params.push(parseInt(year));
      }

      // If a decade filter is provided, add conditions to filter movies released within that decade by calculating the 
      // start and end years of the decade and adding a condition to check if the movie's release year falls within that range
      if (decade) {
        const decadeStart = parseInt(decade);
        query += ' AND year >= ? AND year < ?';
        params.push(decadeStart, decadeStart + 10);
      }

      // Add an ORDER BY clause to the query based on the specified sort field and order (ascending or descending)
      query += ` ORDER BY ${sort} ${order.toUpperCase()}`;

      // Execute the constructed query with the accumulated parameters, and return the list of movies as a JSON response to the client
      const movies = await db.all(query, params);
      res.json(movies);
    } 
    // If any error occurs during the database queries, return a 500 error response with the error message
    catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
