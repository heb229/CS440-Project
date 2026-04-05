export default function moviesRoutes(app, db) {
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

    try {
      let query = 'SELECT * FROM movies WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND title LIKE ?';
        params.push(`%${search}%`);
      }

      if (genre) {
        const selectedGenres = genre.split(',').map((value) => value.trim());

        if (mode === 'or') {
          const genreConditions = selectedGenres.map(() => 'genre LIKE ?').join(' OR ');
          query += ` AND (${genreConditions})`;
          selectedGenres.forEach((selectedGenre) => {
            params.push(`%${selectedGenre}%`);
          });
        } else {
          selectedGenres.forEach((selectedGenre) => {
            query += ' AND genre LIKE ?';
            params.push(`%${selectedGenre}%`);
          });
        }
      }

      if (year) {
        query += ' AND year = ?';
        params.push(parseInt(year));
      }

      if (decade) {
        const decadeStart = parseInt(decade);
        query += ' AND year >= ? AND year < ?';
        params.push(decadeStart, decadeStart + 10);
      }

      query += ` ORDER BY ${sort} ${order.toUpperCase()}`;

      const movies = await db.all(query, params);
      res.json(movies);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
