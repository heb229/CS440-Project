const list = document.getElementById('movies')
const search = document.getElementById('search')
const sort = document.getElementById('sort')
const toggleOrderBtn = document.getElementById('toggleOrder')
const genreCheckboxes = document.querySelectorAll('#genre-filters input[type="checkbox"]')

let sortOrder = 'asc'

async function loadMovies() {
  const selectedGenres = Array.from(genreCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value)

  const params = new URLSearchParams({
    search: search.value,
    sort: sort.value,
    order: sortOrder
  })

  if (selectedGenres.length > 0) {
    params.set('genre', selectedGenres.join(','))
  }

  const res = await fetch(`/api/movies?${params}`)
  const movies = await res.json()

  list.innerHTML = ''
  if (!movies || movies.length === 0) {
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
toggleOrderBtn.onclick = () => {
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  loadMovies()
}

// Initial load
loadMovies()
