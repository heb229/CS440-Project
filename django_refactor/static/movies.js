// Movies API - Django backend
export async function getMovies(filters = {}) {
  try {
    const url = new URL("/api/movies/", window.location.origin);

    if (filters.search) url.searchParams.append("search", filters.search);
    if (filters.genre) url.searchParams.append("genre", filters.genre);
    if (filters.mode) url.searchParams.append("mode", filters.mode);
    if (filters.sort) url.searchParams.append("sort", filters.sort);
    if (filters.order) url.searchParams.append("order", filters.order);
    if (filters.year) url.searchParams.append("year", filters.year);
    if (filters.decade) url.searchParams.append("decade", filters.decade);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const movies = await response.json();
    return movies;
  } catch (err) {
    console.error("Error fetching movies:", err);
    throw err;
  }
}

export async function getMovieDetail(movieId) {
  try {
    const response = await fetch(`/api/movies/${movieId}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const movie = await response.json();
    return movie;
  } catch (err) {
    console.error("Error fetching movie:", err);
    throw err;
  }
}
