const list = document.getElementById('movies')
const search = document.getElementById('search')
const sort = document.getElementById('sort')
const toggleOrderBtn = document.getElementById('toggleOrder')

// Grab all genre checkboxes
const genreCheckboxes = document.querySelectorAll('#genre-filters input[type="checkbox"]')

// default order
let sortOrder = 'asc'

async function loadMovies() {
  // Collect selected genres
  const selectedGenres = Array.from(genreCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value)

  // Build query params
  const params = new URLSearchParams({
    search: search.value,
    sort: sort.value,
    order: sortOrder
  })

  // Add genres as comma-separated string
  if (selectedGenres.length > 0) {
    params.set('genre', selectedGenres.join(','))
  }

  const res = await fetch(`/api/movies?${params}`)
  const movies = await res.json()

  // Render movies
  list.innerHTML = ''
  if (movies.length === 0) {
    list.innerHTML = '<li>No movies found</li>'
    return
  }

  movies.forEach(movie => {
    const li = document.createElement('li')
    li.innerHTML = `
      <a href="movie.html?id=${movie.id}">
        ${movie.title} (${movie.year}) | Rating: ${movie.rating} | <em>${movie.genre}</em>
      </a>
    `
    list.appendChild(li)
  })
}

// Event listeners
search.oninput = loadMovies
sort.onchange = loadMovies
genreCheckboxes.forEach(cb => cb.onchange = loadMovies)

// Toggle ascending/descending order
toggleOrderBtn.onclick = () => {
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  loadMovies()
}

// Initial load
loadMovies()
