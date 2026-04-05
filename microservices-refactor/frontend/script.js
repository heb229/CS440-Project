const movieList = document.getElementById('movies')
const searchInput = document.getElementById('search')
const sortSelect = document.getElementById('sort')
const toggleOrderButton = document.getElementById('toggleOrder')
const genreCheckboxes = document.querySelectorAll('#genre-filters input[type="checkbox"]')
const genreModeRadios = document.querySelectorAll('input[name="genre-mode"]')

let sortOrder = 'asc'

function getSelectedGenres() {
  return Array.from(genreCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value)
}

function getSelectedGenreMode() {
  return Array.from(genreModeRadios).find((radio) => radio.checked)?.value || 'or'
}

function createMovieLink(movie) {
  const link = document.createElement('a')
  link.href = `./movie.html?id=${encodeURIComponent(movie.id)}`
  link.innerHTML = `${movie.title} (${movie.year}) | <em>${movie.genre}</em> | Rating: ${movie.rating}`
  link.addEventListener('click', () => {
    localStorage.setItem('selectedMovieId', String(movie.id))
  })
  return link
}

async function loadMovies() {
  const selectedGenres = getSelectedGenres()
  const genreMode = getSelectedGenreMode()

  const params = new URLSearchParams({
    search: searchInput.value,
    sort: sortSelect.value,
    order: sortOrder
  })

  if (selectedGenres.length > 0) {
    params.set('genre', selectedGenres.join(','))
    params.set('mode', genreMode)
  }

  const response = await fetch(`http://localhost:3000/movies?${params}`)
  const movies = await response.json()

  movieList.innerHTML = ''

  if (!movies || movies.length === 0) {
    movieList.innerHTML = '<li>No movies found</li>'
    return
  }

  movies.forEach((movie) => {
    const listItem = document.createElement('li')
    listItem.appendChild(createMovieLink(movie))
    movieList.appendChild(listItem)
  })
}

searchInput.oninput = loadMovies
sortSelect.onchange = loadMovies
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

loadMovies()
