import db from "../database-layer/db.js";

// function retrieves critiques, optionally filtered by movie id
export async function getAllCritiques(movieId = null) {
  let sql = `
    SELECT mc.*, m.title AS movie_title
    FROM movie_critiques mc
    JOIN movies m ON mc.movie_id = m.id
  `;
  const params = [];

  if (movieId) {
    sql += " WHERE mc.movie_id = $1";
    params.push(movieId);
  }
  
  // order by descending 
  sql += " ORDER BY mc.created_at DESC";

  const result = await db.query(sql, params);
  return result.rows;
}

// function creates a new critique 
export async function createCritique(critiqueData) {
  const { movie_id, title, author, content } = critiqueData;

  const result = await db.query(
    `
    INSERT INTO movie_critiques (movie_id, title, author, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [movie_id, title, author, content]
  );

  return result.rows[0];
}