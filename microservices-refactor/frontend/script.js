// Get references to the DOM elements for the movie list, search input, sort select, toggle order button, 
// genre checkboxes, and genre mode radio buttons
const movieList = document.getElementById('movies')
const searchInput = document.getElementById('search')
const sortSelect = document.getElementById('sort')
const toggleOrderButton = document.getElementById('toggleOrder')
const genreCheckboxes = document.querySelectorAll('#genre-filters input[type="checkbox"]')
const genreModeRadios = document.querySelectorAll('input[name="genre-mode"]')

// Initialize the sort order to ascending
let sortOrder = 'asc'

// Helper function to get the selected genres from the genre checkboxes, and return them as an array of genre values
function getSelectedGenres() {
  return Array.from(genreCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value)
}

// Helper function to get the selected genre mode from the genre mode radio buttons, and return the value of the 
// selected radio button, or 'or' as a default if no radio button is selected
function getSelectedGenreMode() {
  return Array.from(genreModeRadios).find((radio) => radio.checked)?.value || 'or'
}

// Helper function to create a link element for a movie, which navigates to the movie details page when clicked, and 
// stores the movie ID in local storage
function createMovieLink(movie) {
  const link = document.createElement('a')
  link.href = `./movie.html?id=${encodeURIComponent(movie.id)}`
  link.innerHTML = `${movie.title} (${movie.year}) | <em>${movie.genre}</em> | Rating: ${movie.rating}`
  link.addEventListener('click', () => {
    localStorage.setItem('selectedMovieId', String(movie.id))
  })
  return link
}

// The loadMovies function is an asynchronous function that fetches the list of movies from the backend based on the 
// current search, sort, and filter criteria. 
async function loadMovies() {
  // Get the selected genres and genre mode from the UI, and construct the query parameters for the API request based on
  const selectedGenres = getSelectedGenres()
  const genreMode = getSelectedGenreMode()

  // Construct the query parameters for the API request based on the current search, sort, and filter criteria
  const params = new URLSearchParams({
    search: searchInput.value,
    sort: sortSelect.value,
    order: sortOrder
  })

  // If any genres are selected, add the genre and mode parameters to the query parameters for the API request
  if (selectedGenres.length > 0) {
    params.set('genre', selectedGenres.join(','))
    params.set('mode', genreMode)
  }

  // Fetch the list of movies from the backend using the constructed query parameters, and await the response
  const response = await fetch(`http://localhost:3000/movies?${params}`)
  const movies = await response.json()

  movieList.innerHTML = ''

  // If the response is not successful, update the movie list to indicate that there was an error loading the movies, and return
  if (!movies || movies.length === 0) {
    movieList.innerHTML = '<li>No movies found</li>'
    return
  }

  // Iterate through the list of movies returned from the backend, create a list item for each movie with a link
  movies.forEach((movie) => {
    const listItem = document.createElement('li')
    listItem.appendChild(createMovieLink(movie))
    movieList.appendChild(listItem)
  })
}

// Add event listeners to the search input, sort select, genre checkboxes, genre mode radio buttons, and 
// toggle order button to call the loadMovies function whenever any of these inputs change
searchInput.oninput = loadMovies
sortSelect.onchange = loadMovies

// Add an event listener to the toggle order button to toggle the sort order between ascending and descending, and call 
// the loadMovies function to refresh the movie list with the new sort order
genreCheckboxes.forEach((checkbox) => {
  checkbox.onchange = loadMovies
})

genreModeRadios.forEach((radio) => {
  radio.onchange = loadMovies
})

toggleOrderButton.onclick = () => {
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  loadMovies()
}

// Call the loadMovies function to fetch and display the list of movies when the page loads
loadMovies()
