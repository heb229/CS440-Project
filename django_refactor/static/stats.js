/*
Statistics information page
*/

export async function getMovieStatistics() {
  try {
    const response = await fetch("/api/stats/");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const stats = await response.json();
    return stats;
  } catch (err) {
    console.error("Error fetching statistics:", err);
    throw err;
  }
}
