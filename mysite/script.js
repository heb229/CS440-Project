const list = document.getElementById('movies')
const search = document.getElementById('search')
const genre = document.getElementById('genre')
const sort = document.getElementById('sort')
const toggleOrderBtn = document.getElementById('toggleOrder')


// default order
let sortOrder = 'asc'

async function loadMovies() {
  const params = new URLSearchParams({
    search: search.value,
    genre: genre.value,
    sort: sort.value,
    order: sortOrder
  })

  const res = await fetch(`/api/movies?${params}`)
  const movies = await res.json()

  list.innerHTML = ''

  if (movies.length === 0) {
    list.innerHTML = '<li>No movies found</li>'
    return
  }

  movies.forEach(movie => {
    const li = document.createElement('li')
    li.innerHTML = `
      <a href="movie.html?id=${movie.id}">
        ${movie.title} (${movie.year}) – Rating: ${movie.rating} – <em>${movie.genre}</em>
      </a>
    `
    list.appendChild(li)
  })
}

// Event listeners
search.oninput = loadMovies
genre.onchange = loadMovies
sort.onchange = loadMovies

// Double-click sort dropdown to toggle ascending/descending
toggleOrderBtn.onclick = () => {
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  loadMovies()
}


// Initial load
loadMovies()
