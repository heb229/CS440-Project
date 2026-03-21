/*
This is for the more details page (singular movie)
*/

export async function getMovieWithCast(movieId) {
  try {
    const response = await fetch(`/api/movies/${movieId}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const movie = await response.json();
    return {
      ...movie,
      director: movie.director_name
        ? { id: movie.director_id, name: movie.director_name }
        : null,
      cast: movie.cast,
    };
  } catch (err) {
    console.error("Error fetching movie with cast:", err);
    throw err;
  }
}
