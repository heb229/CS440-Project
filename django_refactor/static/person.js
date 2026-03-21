/*
Page for the actors/directors
*/

export async function getPersonDetail(personId) {
  try {
    const response = await fetch(`/api/person/${personId}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const person = await response.json();
    return {
      ...person,
      actedMovies: person.acted_movies,
      directedMovies: person.directed_movies,
    };
  } catch (err) {
    console.error("Error fetching person:", err);
    throw err;
  }
}
