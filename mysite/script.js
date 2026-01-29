const list = document.getElementById('movies')
const search = document.getElementById('search')
const genre = document.getElementById('genre')
const sort = document.getElementById('sort')

async function loadMovies() {
  const params = new URLSearchParams({
    search: search.value,
    genre: genre.value,
    sort: sort.value
  })

  const res = await fetch(`/api/movies?${params}`)
  const movies = await res.json()

  list.innerHTML = ''

  movies.forEach(movie => {
    const li = document.createElement('li')
    li.innerHTML = `
      <a href="movie.html?id=${movie.id}">
        ${movie.title} (${movie.year}) – Rating: ${movie.rating}
      </a>
    `
    list.appendChild(li)
  })
}

search.oninput = loadMovies
genre.onchange = loadMovies
sort.onchange = loadMovies

loadMovies()


